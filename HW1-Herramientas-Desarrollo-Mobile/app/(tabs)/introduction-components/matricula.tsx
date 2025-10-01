import { Text, StyleSheet } from "react-native";

export default function Matricula({ matricula }: { matricula: string }) {
  return (
    <Text style={styles.matricula}>Finally, my student ID is {matricula}</Text>
  );
}

const styles = StyleSheet.create({
  matricula: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
});
