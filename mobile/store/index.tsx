import { createContext, useContext, useState } from "react";
import Constants from "expo-constants";
import { TeamData } from "@/types";

const TEAM_DATA = Constants.expoConfig?.extra?.team;

export const TeamContext = createContext({
  team: TEAM_DATA,
  setTeam: (_team?: TeamData) => {},
});

export const useTeam = () => useContext(TeamContext);

type TeamProviderProps = {
  children: React.ReactNode;
};

export const TeamProvider = ({ children }: TeamProviderProps) => {
  const [team, setTeam] = useState<TeamData | undefined>(TEAM_DATA);

  return (
    <TeamContext.Provider value={{ team, setTeam }}>
      {children}
    </TeamContext.Provider>
  );
};
