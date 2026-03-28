import axios from "axios";

// Define constants
const CHATGPT_END_POINT = "https://api.openai.com/v1/chat/completions";
const CHATGPT_MODEL = "gpt-3.5-turbo";

// Function to send a message to the ChatGPT API and return the response
export const postChatGPTMessage = async (message, openAIKey) => {
  const trimmedMessage = message?.trim();
  const trimmedOpenAIKey = openAIKey?.trim();

  if (!trimmedMessage || !trimmedOpenAIKey) {
    return null;
  }

  // Set headers for the axios request
  const config = {
    headers: {
      Authorization: `Bearer ${trimmedOpenAIKey}`,
      "Content-Type": "application/json",
    },
  };

  // Create the message object to send to the API
  const userMessage = { role: "user", content: trimmedMessage };

  // Define the data to send in the request body
  const chatGPTData = {
    model: CHATGPT_MODEL,
    messages: [userMessage],
  };

  try {
    // Send a POST request to the ChatGPT API
    const response = await axios.post(CHATGPT_END_POINT, chatGPTData, config);

    // Extract the message content from the API response
    const generatedMessage = response?.data?.choices?.[0]?.message?.content;

    // Return the message content
    return typeof generatedMessage === "string"
      ? generatedMessage.trim()
      : null;
  } catch (error) {
    console.error("Error with ChatGPT API", error);

    // Return null if an error occurs
    return null;
  }
};
