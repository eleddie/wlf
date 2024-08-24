import { Logo, Screen, Text, Title, Button } from "@/components";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useContext } from "react";
import { TeamContext } from "@/store";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function IntroTeam() {
  const { team, setTeam } = useContext(TeamContext);
  const router = useRouter();

  const handleBack = () => {
    setTeam(undefined);
    router.navigate("/");
  };
  if (!team) {
    return null;
  }

  return (
    <Screen>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
      </TouchableOpacity>
      <View style={styles.container}>
        <Logo uri={team.image} />
        <View style={styles.textContainer}>
          <Title>{team.name}</Title>
          <Text>
            Get the latest news, fixtures, and results from {team.name}
          </Text>
        </View>

        <Button onPress={() => {}}>Start Here!</Button>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
  },
  backButton: {
    paddingVertical: 16,
  },
  image: {
    width: "60%",
    aspectRatio: 1,
  },
  textContainer: {
    gap: 16,
  },
  buttonsContainer: {
    width: "100%",
    flexDirection: "row",
    gap: 16,
    justifyContent: "space-between",
  },
});
