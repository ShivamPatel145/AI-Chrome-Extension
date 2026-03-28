import { API_CONFIG } from "./constants";

const isModelUnavailableError = (error) => {
  const status = error?.response?.status;
  const apiMessage = (
    error?.response?.data?.error?.message || ""
  ).toLowerCase();

  if (status === 404) return true;
  if (
    status === 400 &&
    /model|not found|not supported|unsupported/i.test(apiMessage)
  ) {
    return true;
  }
  return false;
};

const getReadableGeminiError = (error) => {
  const status = error?.response?.status;
  const apiMessage = error?.response?.data?.error?.message;
  const apiErrorStatus = error?.response?.data?.error?.status;

  const rawErrorText = [apiErrorStatus, apiMessage]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (status === 401 || status === 403) {
    return "API key rejected. Verify your key in Google AI Studio.";
  }

  if (status === 429) {
    if (/quota|billing|limit|exhausted/i.test(rawErrorText)) {
      return "API quota exhausted. Check your Google Cloud limits.";
    }
    return "Rate limit reached. Wait a moment and retry.";
  }

  if (
    status === 404 ||
    (typeof apiMessage === "string" && /model|not found/i.test(apiMessage))
  ) {
    return "Gemini model unavailable for this API key.";
  }

  if (typeof apiMessage === "string" && apiMessage.trim()) {
    return apiMessage.trim();
  }

  return "Unable to reach Gemini API. Check your connection.";
};

export const postGeminiMessage = async (message, geminiApiKey) => {
  const trimmedMessage = message?.trim();
  const trimmedGeminiApiKey = geminiApiKey?.trim();

  if (!trimmedMessage || !trimmedGeminiApiKey) {
    throw new Error("Message and API key are required.");
  }

  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [{ text: trimmedMessage }],
      },
    ],
  };

  for (const model of API_CONFIG.GEMINI_MODELS) {
    const endpoint = `${API_CONFIG.GEMINI_BASE_URL}/${model}:generateContent?key=${encodeURIComponent(trimmedGeminiApiKey)}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        API_CONFIG.GEMINI_TIMEOUT_MS,
      );

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error();
        error.response = { status: response.status, data: errorData };
        throw error;
      }

      const data = await response.json();
      const generatedMessage = data?.candidates?.[0]?.content?.parts
        ?.map((part) => part?.text || "")
        .join("\n")
        .trim();

      if (!generatedMessage) {
        throw new Error("Gemini returned an empty response.");
      }

      return generatedMessage;
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("Request timed out. Please retry.");
      }
      if (isModelUnavailableError(error)) continue;
      throw new Error(getReadableGeminiError(error));
    }
  }

  throw new Error(
    "No compatible Gemini model available. Enable Gemini API in Google AI Studio.",
  );
};
