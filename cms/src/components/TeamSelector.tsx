import { useEffect, useState } from "react";
import { TeamDataType } from "../types";
import { getTeams } from "../api";
import { sortBy } from "lodash";

function TeamSelector() {
  const [teams, setTeams] = useState<TeamDataType[]>([]);

  useEffect(() => {
    getTeams().then((data: TeamDataType[]) => {
      const teamsArr = Object.values(data);
      const sortedTeams = sortBy(teamsArr, (t) => t.name);
      setTeams(sortedTeams);
    });
  }, []);

  return (
    <div>
      <h1 className="text-6xl font-semibold">Select your team</h1>
      <br />
      <select
        className="text-xl p-2 rounded-md"
        onChange={(e) => (window.location.href = `/${e.target.value}`)}
      >
        <option value="">Select a team</option>
        {teams.map((team) => (
          <option key={team.slug} value={team.slug}>
            {team.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default TeamSelector;
