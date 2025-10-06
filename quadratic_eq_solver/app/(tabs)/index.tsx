// Controller
import { StyleSheet, Alert } from "react-native";
import QuadraticEquationView from "./QuadraticEquationView";
import { QuadraticEquationModel } from "./Model";
import { useState, useMemo, useCallback, useEffect } from "react";

export default function HomeScreen() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [results, setResults] = useState({
    root1: "N/A",
    root2: "N/A",
    message: "",
    isError: false,
  });
  const model = useMemo(() => new QuadraticEquationModel(), []);

  function onChangeA(text: string): void {
    const numeric = text.replace(/[^0-9.\-]/g, ""); // Allow only digits, dot, and minus
    setA(numeric);
  }

  function onChangeB(text: string): void {
    const numeric = text.replace(/[^0-9.\-]/g, "");
    setB(numeric);
  }

  function onChangeC(text: string): void {
    const numeric = text.replace(/[^0-9.\-]/g, "");
    setC(numeric);
  }

  const calculateRoots = useCallback(() => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    const numC = parseFloat(c);

    if (
      isNaN(numA) ||
      isNaN(numB) ||
      isNaN(numC) ||
      a.trim() === "" ||
      b.trim() === "" ||
      c.trim() === ""
    ) {
      setResults((prev) => ({
        ...prev,
        message: "Please type valid numeric values",
        isError: true,
      }));
      return;
    }

    const calculatedResults = model.solve(numA, numB, numC);

    setResults(calculatedResults);
  }, [a, b, c, model]);

  useEffect(() => {
    // Only show alert if there is an error message (non empty, not "Successful!")
    if (results.message !== "" && results.message !== "Successful!") {
      Alert.alert(
        "Error:",
        results.message,
        [
          {
            text: "Accept",
            onPress: () => {
              setA("");
              setB("");
              setC("");

              setResults((prev) => ({
                ...prev,
                message: "",
                isError: false,
              }));
            },
          },
        ],
        { cancelable: false }
      );
    }
  }, [results.message]);

  return (
    <QuadraticEquationView
      a={a}
      setA={onChangeA}
      b={b}
      setB={onChangeB}
      c={c}
      setC={onChangeC}
      results={results}
      calculateRoots={calculateRoots}
    />
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
