import { Text as RNText, StyleSheet } from "react-native";

type TextProps = {
  readonly children: React.ReactNode;
};

export default function Text({ children }: TextProps) {
  return <RNText style={styles.text}>{children}</RNText>;
}

const styles = StyleSheet.create({
  text: {
    color: "white",
    fontSize: 20,
  },
});
