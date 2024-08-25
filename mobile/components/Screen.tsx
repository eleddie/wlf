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
  const colorStart = mixGradient(
    generic || !team?.primaryColor ? PRIMARY_COLOR : team.primaryColor,
    "#454545"
  );
  const colorEnd = mixGradient(
    generic || !team?.secondaryColor ? SECONDARY_COLOR : team.secondaryColor,
    "#212121"
  );

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
