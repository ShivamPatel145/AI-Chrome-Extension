import React, { useEffect, useState } from "react";
import Generator from "./components/Generator";
import Profile from "./components/Profile";
import { ROUTES } from "./utils/routes";
import { loadData } from "./utils/localStorage";

function App() {
  const [page, setPage] = useState(ROUTES.GENERATOR);
  const [resume, setResume] = useState("");
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const fetchLocalData = async () => {
      const fetchedResume = await loadData("resume");
      const fetchedApiKey = await loadData("apiKey");
      setResume(fetchedResume || "");
      setApiKey(fetchedApiKey || "");
    };
    fetchLocalData();
  }, []);

  switch (page) {
    case ROUTES.GENERATOR:
      return <Generator setPage={setPage} />;
    case ROUTES.PROFILE:
      return (
        <Profile
          setPage={setPage}
          resume={resume}
          setResume={setResume}
          apiKey={apiKey}
          setApiKey={setApiKey}
        />
      );
    default:
      return <Generator setPage={setPage} />;
  }
}

export default App;
