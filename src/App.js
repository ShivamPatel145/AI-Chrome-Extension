import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { PAGES } from "./utils/pages";
import Generator from "./pages/Generator";
import Profile from "./pages/Profile";
import { loadData } from "./utils/localStorage";

function App() {
  // State management
  const [page, setPage] = useState(PAGES.GENERATOR);
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [resume, setResume] = useState("");

  // Load data from local storage on component mount
  useEffect(() => {
    const fetchLocalData = async () => {
      try {
        const localResume = await loadData("resume");
        const localGeminiApiKey = await loadData("geminiApiKey");
        const legacyOpenAIKey = await loadData("openAIKey");

        setResume(localResume || "");
        setGeminiApiKey(localGeminiApiKey || legacyOpenAIKey || "");
      } catch (error) {
        console.error("Failed to load saved profile data", error);
      }
    };

    fetchLocalData();
  }, []);

  // Render components based on the current page
  switch (page) {
    case PAGES.GENERATOR:
      return (
        <Generator
          setPage={setPage}
          resume={resume}
          geminiApiKey={geminiApiKey}
        />
      );

    case PAGES.PROFILE:
      return (
        <Profile
          setPage={setPage}
          setGeminiApiKey={setGeminiApiKey}
          setResume={setResume}
          resume={resume}
          geminiApiKey={geminiApiKey}
        />
      );

    default:
      return (
        <Generator
          setPage={setPage}
          resume={resume}
          geminiApiKey={geminiApiKey}
        />
      );
  }
}

export default App;
