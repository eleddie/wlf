import "./App.css";
import TeamData from "./components/TeamData";
import TeamSelector from "./components/TeamSelector";

function App() {
  const teamSlug = window.location.pathname.replace("/", "");

  if (!teamSlug) {
    return <TeamSelector />;
  }

  return <TeamData slug={teamSlug} />;
}

export default App;
