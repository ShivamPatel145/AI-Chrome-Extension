import React from "react";
import { VscGear } from "react-icons/vsc";
import { ROUTES } from "../utils/routes";

function Generator({ setPage }) {
  const [output, setOutput] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      // Add your API call logic here
      console.log("Generating cover letter...");
      // Example: const response = await fetch('YOUR_API_ENDPOINT', {...})
    } catch (error) {
      console.error("Error generating cover letter:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex flex-row justify-between items-center mx-5 my-3 gap-4">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 flex-shrink-0"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
        <h2 className="text-lg font-semibold flex-1 text-center">
          LinkedIn Cover Letter Generator
        </h2>
        <button
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600 flex-shrink-0"
          onClick={() => setPage(ROUTES.PROFILE)}
        >
          <VscGear size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 items-center justify-center px-5 pb-5 overflow-hidden">
        <textarea
          value={output}
          readOnly
          className="w-full h-full p-4 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          placeholder="Your generated cover letter will appear here..."
        />
      </div>
    </div>
  );
}

export default Generator;
