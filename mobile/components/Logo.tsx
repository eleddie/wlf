import { Image } from "expo-image";
import { StyleSheet } from "react-native";

const logo = require("@/assets/images/logo.png");

type LogoProps = {
  readonly uri?: string;
};
export default function Logo({ uri }: LogoProps) {
  return (
    <Image
      source={uri ? { uri } : logo}
      style={styles.image}
      contentFit="contain"
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: "60%",
    aspectRatio: 1,
  },
});
