import axios from "axios";

// Define constants
const GEMINI_BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/models";
const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash"];

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
    return "Gemini rejected your API key. Verify the key and API access in Google AI Studio.";
  }

  if (status === 429) {
    const isQuotaOrBillingError = /quota|billing|limit|exhausted/i.test(
      rawErrorText,
    );

    if (isQuotaOrBillingError) {
      return "Gemini quota is exhausted. Check limits or billing in your Google project, then try again.";
    }

    return "Gemini rate limit reached. Wait a moment and try again.";
  }

  if (
    status === 404 ||
    (typeof apiMessage === "string" && /model|not found/i.test(apiMessage))
  ) {
    return "The configured Gemini model is unavailable for this API key.";
  }

  if (typeof apiMessage === "string" && apiMessage.trim()) {
    return apiMessage.trim();
  }

  return "Unable to reach Gemini API. Check internet access and extension permissions.";
};

// Function to send a message to Gemini API and return the response text
export const postGeminiMessage = async (message, geminiApiKey) => {
  const trimmedMessage = message?.trim();
  const trimmedGeminiApiKey = geminiApiKey?.trim();

  if (!trimmedMessage || !trimmedGeminiApiKey) {
    throw new Error("Message and Gemini API key are required.");
  }

  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [{ text: trimmedMessage }],
      },
    ],
  };

  for (const model of GEMINI_MODELS) {
    const endpoint = `${GEMINI_BASE_URL}/${model}:generateContent?key=${encodeURIComponent(trimmedGeminiApiKey)}`;

    try {
      const response = await axios.post(endpoint, requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const generatedMessage = response?.data?.candidates?.[0]?.content?.parts
        ?.map((part) => part?.text || "")
        .join("\n")
        .trim();

      if (typeof generatedMessage !== "string" || !generatedMessage.trim()) {
        throw new Error("Gemini returned an empty response.");
      }

      return generatedMessage.trim();
    } catch (error) {
      if (isModelUnavailableError(error)) {
        continue;
      }

      console.error("Error with Gemini API", error);
      throw new Error(getReadableGeminiError(error));
    }
  }

  throw new Error(
    "No compatible Gemini model is available for this API key. Enable Gemini API access in Google AI Studio/Google Cloud or create a key in a project with Gemini enabled.",
  );
};
