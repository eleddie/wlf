import { useEffect, useState } from "react";
import { TeamDataType } from "../types";
import { getTeams } from "../api";
import { kebabCase, sortBy } from "lodash";

function TeamSelector() {
  const [teams, setTeams] = useState<TeamDataType[]>([]);
  const [newTeam, setNewTeam] = useState<string>("");

  useEffect(() => {
    getTeams().then((data: TeamDataType[]) => {
      const teamsArr = Object.values(data);
      const sortedTeams = sortBy(teamsArr, (t) => t.name);
      setTeams(sortedTeams);
    });
  }, []);

  const onCreateTeam = () => {
    if (!newTeam) return;
    window.location.href = `/${kebabCase(newTeam)}`;
  };

  return (
    <div className="flex flex-row gap-16 justify-center items-center">
      <div className="flex flex-col justify-center items-center">
        <h2 className="text-5xl font-semibold">Select your team</h2>

        <br />

        <select
          className="text-xl p-2 rounded-md w-56"
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

      <div
        style={{
          width: "0.5px",
          height: "200px",
          background: "#777",
        }}
      ></div>

      <div className="flex flex-col justify-center items-center">
        <h2 className="text-5xl font-semibold">Create a new team</h2>
        <br />
        <div className="flex flex-row gap-8">
          <input
            type="text"
            placeholder="Team Name"
            className="p-2 rounded-md"
            onChange={(e) => setNewTeam(e.target.value)}
            value={newTeam}
          />

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={onCreateTeam}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

export default TeamSelector;
