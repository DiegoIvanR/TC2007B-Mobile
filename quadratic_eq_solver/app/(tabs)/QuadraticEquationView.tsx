// View
import {
  View,
  TextInput,
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

type QuadraticEquationViewProps = {
  a: string;
  setA: (value: string) => void;
  b: string;
  setB: (value: string) => void;
  c: string;
  setC: (value: string) => void;
  results: {
    root1: string;
    root2: string;
    message: string;
    isError: boolean;
  };
  calculateRoots: () => void;
};

export default function QuadraticEquationView({
  a,
  setA,
  b,
  setB,
  c,
  setC,
  results,
  calculateRoots,
}: QuadraticEquationViewProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedView style={styles.header}>
          <ThemedText type="subtitle">Quadratic equations solver</ThemedText>
          <ThemedText type="title">ax² + bx + c = 0</ThemedText>
        </ThemedView>

        <ThemedView style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>a:</Text>
            <TextInput
              value={a}
              onChangeText={setA}
              placeholder="Enter value for a"
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>b:</Text>
            <TextInput
              value={b}
              onChangeText={setB}
              placeholder="Enter value for b"
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>c:</Text>
            <TextInput
              value={c}
              onChangeText={setC}
              placeholder="Enter value for c"
              style={styles.input}
            />
          </View>
        </ThemedView>

        <View style={styles.buttonContainer}>
          <Button title="Calculate" onPress={calculateRoots} />
        </View>

        {results.message === "Successful!" && (
          <View style={styles.results}>
            <Text style={styles.resultText}>X₁: {results.root1}</Text>
            <Text style={styles.resultText}>X₂: {results.root2}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? 25 : 0, // for Android status bar
  },
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#fff",
    flexGrow: 1,
    justifyContent: "flex-start",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 12,
    alignItems: "center",
    textAlign: "center",
    padding: 25,
  },
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
    display: "flex",
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
    justifyContent: "space-around",
  },
  label: {
    fontSize: 18,
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    borderRadius: 8,
    backgroundColor: "#fafafa",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    width: "80%",
  },
  buttonContainer: {
    marginBottom: 32,
  },
  results: {
    padding: 16,
    alignItems: "center",
  },
  resultText: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
    color: "#2a662a",
  },
});
