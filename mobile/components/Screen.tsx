import { SafeAreaView, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Color from "color";
import { PRIMARY_COLOR, SECONDARY_COLOR } from "@/constants/Colors";
import { useContext } from "react";
import { TeamContext } from "@/store";

type ScreenProps = {
  readonly children: React.ReactNode;
  readonly generic?: boolean;
};

const mixGradient = (color1: string, color2: string) => {
  return Color(color1).mix(Color(color2), 0.5).hex();
};

export default function Screen({ generic, children }: ScreenProps) {
  const { team } = useContext(TeamContext);
  const useGray = generic || !team?.primaryColor || !team?.secondaryColor;

  const colorStart = useGray
    ? PRIMARY_COLOR
    : mixGradient(team.primaryColor, "#444");
  const colorEnd = useGray
    ? SECONDARY_COLOR
    : mixGradient(team.secondaryColor, "#222");

  return (
    <LinearGradient
      style={styles.container}
      colors={[colorStart, colorEnd]}
      start={{ x: 0, y: 0.4 }}
      end={{ x: 1, y: 0.6 }}
    >
      <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
