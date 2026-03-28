import React, { useEffect, useState } from "react";
import { VscGear } from "react-icons/vsc";
import { PAGES } from "../utils/pages";
import { loadData } from "../utils/localStorage";
import { postGeminiMessage } from "../utils/chatgpt";

function Generator({ setPage, resume, geminiApiKey }) {
  const [jobDescription, setJobDescription] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    // Load job description from local storage on component mount
    const getJobDescription = async () => {
      try {
        const description = await loadData("jobDescription");
        if (isMounted) {
          setJobDescription(description || "");
        }
      } catch (error) {
        console.error("Error while fetching job description", error);
      }
    };

    getJobDescription();

    return () => {
      isMounted = false;
    };
  }, []);

  const generateCoverLetter = async () => {
    if (isLoading) return;

    const trimmedResume = resume?.trim();
    const trimmedGeminiApiKey = geminiApiKey?.trim();
    const trimmedJobDescription = jobDescription?.trim();

    if (!trimmedGeminiApiKey) {
      setErrorMessage(
        "Please add your Gemini API key in Profile before generating.",
      );
      return;
    }

    if (!trimmedResume) {
      setErrorMessage("Please save your resume in Profile before generating.");
      return;
    }

    if (!trimmedJobDescription) {
      setErrorMessage(
        "No job description found on the page. Open a job post and try again.",
      );
      return;
    }

    setErrorMessage("");
    setIsLoading(true);

    try {
      // Create message to send to Gemini API
      const message = `Generate a concise, professional cover letter based on the following resume and job description.\n\nRESUME:\n${trimmedResume}\n\nJob Description:\n${trimmedJobDescription}`;
      // Send message to Gemini API and wait for response
      const generatedCoverLetter = await postGeminiMessage(
        message,
        trimmedGeminiApiKey,
      );

      // Update state with generated cover letter
      setCoverLetter(generatedCoverLetter);
    } catch (error) {
      console.error("Error while generating cover letter", error);
      const fallbackMessage =
        "Something went wrong while generating. Please try again.";
      setErrorMessage(error?.message || fallbackMessage);
    } finally {
      // Set loading state to false once the process is complete (whether it was successful or not)
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between mx-5 my-3 items-center">
        <button
          disabled={isLoading}
          onClick={generateCoverLetter}
          className="border-2 border-solid border-blue-500 text-blue-500 text-lg font-bold rounded-md px-3 py-2 hover:text-white hover:bg-blue-500"
        >
          {isLoading ? "Generating..." : "Generate"}
        </button>
        <h2 className="text-2xl font-bold">LinkedIn Cover Letter Generator</h2>
        <button
          onClick={() => setPage(PAGES.PROFILE)}
          className="border mr-[1px] p-2 border-solid border-gray-600 rounded-[100%] hover:bg-gray-200 hover:border-2 hover:mr-0 transition duration-300 ease-in-out"
        >
          <VscGear className="text-[150%] text-gray-500" />
        </button>
      </div>
      <div className="flex mx-5">
        <textarea
          rows={12}
          className="w-full"
          placeholder="Generated cover letter"
          value={coverLetter}
          readOnly
        />
      </div>
      {errorMessage ? (
        <p className="mx-5 mt-2 text-sm text-red-600">{errorMessage}</p>
      ) : null}
    </div>
  );
}

export default Generator;
