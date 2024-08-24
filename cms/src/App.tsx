import "./App.css";
import { useEffect, useState } from "react";
import TeamData, { TeamDataType } from "./components/TeamData";
import { getTeam } from "./api";

function App() {
  const teamSlug = window.location.pathname.replace("/", "");
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState<TeamDataType | undefined>();

  useEffect(() => {
    setLoading(true);
    getTeam(teamSlug).then((data) => {
      setTeam(data);
      setLoading(false);
    });
  }, []);

  if (loading || !team) {
    return <div>Loading...</div>;
  }
  return <TeamData {...team} slug={teamSlug} />;
}

export default App;
