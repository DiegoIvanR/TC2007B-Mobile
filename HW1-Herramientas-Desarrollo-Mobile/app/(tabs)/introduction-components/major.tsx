import { Text, StyleSheet } from "react-native";

export default function Major({
  major,
  university,
}: {
  major: string;
  university: string;
}) {
  return (
    <Text style={styles.major}>
      I'm currently studying {major} @ {university}
    </Text>
  );
}

const styles = StyleSheet.create({
  major: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
});
