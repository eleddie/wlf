import { Logo, Screen, Text, Title, Button } from "@/components";
import { StyleSheet, View } from "react-native";
import TeamSelector from "../components/TeamSelector";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { TeamContext } from "@/store";
import { TeamData } from "@/types";
import { getTeams } from "@/api";
import { sortBy } from "lodash";

export default function SelectTeam() {
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | undefined>("");
  const teamContext = useContext(TeamContext);
  const router = useRouter();

  useEffect(() => {
    getTeams().then((res: TeamData[]) => {
      const teamsArr = Object.values(res);
      const sortedTeams = sortBy(teamsArr, (team) => team.name);
      setTeams(sortedTeams);
    });
  }, []);

  const handleNext = () => {
    const teamData = teams.find((t) => t.slug === selectedTeam);
    if (!teamData) return;
    teamContext.setTeam(teamData);
    router.navigate("/intro-team");
  };

  return (
    <Screen generic>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Logo />
          <Title>Find your team</Title>
          <Text>Select your favorite team to get started</Text>
          <TeamSelector
            teams={teams}
            team={selectedTeam}
            setTeam={setSelectedTeam}
          />
        </View>
        <Button onPress={handleNext}>Next</Button>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  image: {
    width: "60%",
    aspectRatio: 1,
  },
  textContainer: {
    gap: 16,
  },
});
