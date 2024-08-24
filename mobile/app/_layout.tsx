import { TeamProvider } from "@/store";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import Constants from "expo-constants";

const TEAM_DATA = Constants.expoConfig?.extra?.team;
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <TeamProvider>
        <Stack
          screenOptions={{ headerShown: false }}
          initialRouteName={TEAM_DATA ? "intro-team" : "index"}
        >
          <Stack.Screen name={"index"} redirect={!!TEAM_DATA} />
          <Stack.Screen name={"intro-team"} />
        </Stack>
      </TeamProvider>
    </>
  );
}
