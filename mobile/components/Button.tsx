import { PRIMARY_COLOR, SECONDARY_COLOR } from "@/constants/Colors";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import color from "color";
import { useContext } from "react";
import { TeamContext } from "@/store";

type ButtonProps = {
  readonly children: React.ReactNode;
  readonly onPress?: () => void;
  readonly generic?: boolean;
};

function sortColorsByBrightness(
  color1: string,
  color2: string
): [string, string] {
  const brightness1 = color(color1).luminosity();
  const brightness2 = color(color2).luminosity();

  if (brightness1 > brightness2) {
    return [color1, color2];
  } else {
    return [color2, color1];
  }
}

export default function Button({ generic, children, onPress }: ButtonProps) {
  const { team } = useContext(TeamContext);
  const sortedColors = sortColorsByBrightness(
    generic || !team?.primaryColor ? PRIMARY_COLOR : team.primaryColor,
    generic || !team?.secondaryColor ? SECONDARY_COLOR : team.secondaryColor
  );
  const backgroundColor = sortedColors[1];
  const textColor =
    color(backgroundColor).luminosity() > 0.5 ? "black" : "white";
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[styles.button, { backgroundColor, borderColor: textColor }]}
      >
        <Text style={[styles.buttonText, { color: textColor }]}>
          {children}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 100,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 32,
    borderWidth: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
