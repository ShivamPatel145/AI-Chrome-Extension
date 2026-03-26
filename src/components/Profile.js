import React from "react";
import { MdArrowBack } from "react-icons/md";

function Profile() {
  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex flex-row justify-between items-center mx-5 my-3 border-b pb-3">
        <button className="p-2 rounded hover:bg-gray-100 flex-shrink-0">
          <MdArrowBack size={20} />
        </button>
        <h2 className="text-2xl font-bold flex-1 text-center">Profile</h2>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>

      {/* Form */}
      <form className="flex flex-col space-y-4 mx-5 mt-4 overflow-y-auto flex-1">
        <div>
          <label
            htmlFor="AIApiKey"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your AI API Key
          </label>
          <input
            type="password"
            id="AIApiKey"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your API key"
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
