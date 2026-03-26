import React from "react";
import { VscGear } from "react-icons/vsc";

function Generator() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex flex-row justify-between items-center mx-5 my-3 gap-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex-shrink-0">
          Generate
        </button>
        <h2 className="text-lg font-semibold flex-1 text-center">
          LinkedIn Cover Letter Generator
        </h2>
        <button className="bg-green-500 text-white p-2 rounded hover:bg-green-600 flex-shrink-0">
          <VscGear size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 items-center justify-center px-5 pb-5 overflow-hidden">
        <textarea
          className="w-full h-full p-4 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Your generated cover letter will appear here..."
        />
      </div>
    </div>
  );
}

export default Generator;
