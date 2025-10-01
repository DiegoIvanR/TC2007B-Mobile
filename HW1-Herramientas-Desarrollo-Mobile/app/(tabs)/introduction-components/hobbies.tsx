import { View, Text, StyleSheet } from "react-native";

export default function Hobbies({ hobbies }: { hobbies: string[] }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Some of my hobbies include:</Text>
      {hobbies.map((hobby) => (
        <Text key={hobby} style={styles.listItem}>
          • {hobby}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000",
  },
  listItem: {
    fontSize: 18,
    marginBottom: 4,
    color: "#000",
  },
});
