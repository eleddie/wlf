import { StyleSheet, Text } from "react-native";

export default function Title({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <Text style={styles.title}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontWeight: "700",
    color: "white",
    fontSize: 32,
  },
});
