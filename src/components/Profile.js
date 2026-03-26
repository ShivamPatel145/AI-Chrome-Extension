import React from "react";
import { MdArrowBack } from "react-icons/md";
import { ROUTES } from "../utils/routes";
import { saveData } from "../utils/localStorage";

function Profile({ setPage, resume, setResume, apiKey, setApiKey }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedResume = formData.get("resume");
    const updatedApiKey = formData.get("apiKey");
    setResume(updatedResume);
    setApiKey(updatedApiKey);
    saveData("resume", updatedResume);
    saveData("apiKey", updatedApiKey);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex flex-row justify-between items-center mx-5 my-3 border-b pb-3">
        <button
          className="p-2 rounded hover:bg-gray-100 flex-shrink-0"
          onClick={() => setPage(ROUTES.GENERATOR)}
        >
          <MdArrowBack size={20} />
        </button>
        <h2 className="text-2xl font-bold flex-1 text-center">Profile</h2>
        <div className="w-10"></div>
      </div>

      {/* Form */}
      <form
        className="flex flex-col space-y-4 mx-5 mt-4 overflow-y-auto flex-1"
        onSubmit={handleSubmit}
      >
        <div>
          <label
            htmlFor="apiKey"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your AI API Key
          </label>
          <input
            type="password"
            id="apiKey"
            name="apiKey"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your API key"
            defaultValue={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="Resume"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Resume
          </label>
          <textarea
            id="Resume"
            name="resume"
            className="w-full p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste your resume here..."
            rows={8}
            defaultValue={resume}
            onChange={(e) => setResume(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full mt-4"
        >
          Save
        </button>
      </form>
    </div>
  );
}

export default Profile;
