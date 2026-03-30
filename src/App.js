import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { PAGES } from "./utils/constants";
import Generator from "./pages/CoverLetterGenerator";
import Profile from "./pages/Profile";
import { loadData } from "./utils/localStorage";

function App() {
  const [page, setPage] = useState(PAGES.GENERATOR);
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [resume, setResume] = useState("");
  const [letterTone, setLetterTone] = useState("professional");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchLocalData = async () => {
      try {
        const localResume = await loadData("resume");
        const localGeminiApiKey = await loadData("geminiApiKey");
        const localLetterTone = await loadData("letterTone");
        const legacyOpenAIKey = await loadData("openAIKey");

        setResume(localResume || "");
        setGeminiApiKey(localGeminiApiKey || legacyOpenAIKey || "");
        setLetterTone(localLetterTone || "professional");
      } catch (error) {
        console.error("Failed to load saved profile data", error);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchLocalData();
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
          <p className="text-xs text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  switch (page) {
    case PAGES.PROFILE:
      return (
        <Profile
          setPage={setPage}
          setGeminiApiKey={setGeminiApiKey}
          setResume={setResume}
          setLetterTone={setLetterTone}
          resume={resume}
          geminiApiKey={geminiApiKey}
          letterTone={letterTone}
        />
      );
    default:
      return (
        <Generator
          setPage={setPage}
          resume={resume}
          geminiApiKey={geminiApiKey}
          letterTone={letterTone}
        />
      );
  }
}

export default App;
