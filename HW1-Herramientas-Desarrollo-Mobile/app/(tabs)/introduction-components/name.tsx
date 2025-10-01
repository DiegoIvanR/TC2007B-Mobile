import { Text, StyleSheet } from "react-native";

export default function Name({ name }: { name: string }) {
  return <Text style={styles.userName}>Hi, my name is {name}!</Text>;
}

const styles = StyleSheet.create({
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
});
