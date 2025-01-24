import Constants from "expo-constants";

const team = Constants.expoConfig?.extra?.team;

const tintColorLight = "#444";
const tintColorDark = "#222";

export const PRIMARY_COLOR = team?.primaryColor ?? tintColorLight;
export const SECONDARY_COLOR = team?.secondaryColor ?? tintColorDark;

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};
