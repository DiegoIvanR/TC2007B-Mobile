import Slider from "@react-native-community/slider";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { loadData, saveData } from "../utils/storage";

export default function App() {
  const [red, setRed] = useState(0);
  const [green, setGreen] = useState(0);
  const [blue, setBlue] = useState(0);

  useEffect(() => {
    const loadColor = async () => {
      const savedColor = await loadData("@rgb");
      if (savedColor) {
        const { r, g, b } = savedColor;
        setRed(r);
        setGreen(g);
        setBlue(b);
      }
    };
    loadColor();
  }, []);

  useEffect(() => {
    saveData("@rgb", { r: red, g: green, b: blue });
  }, [red, green, blue]);

  const bgColor = `rgb(${red}, ${green}, ${blue})`;

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Text style={styles.text}>R: {red}</Text>
      <Slider
        minimumValue={0}
        maximumValue={255}
        step={1}
        value={red}
        onValueChange={setRed}
        minimumTrackTintColor="red"
      />

      <Text style={styles.text}>G: {green}</Text>
      <Slider
        minimumValue={0}
        maximumValue={255}
        step={1}
        value={green}
        onValueChange={setGreen}
        minimumTrackTintColor="green"
      />

      <Text style={styles.text}>B: {blue}</Text>
      <Slider
        minimumValue={0}
        maximumValue={255}
        step={1}
        value={blue}
        onValueChange={setBlue}
        minimumTrackTintColor="blue"
      />

      <Text style={[styles.text, { marginTop: 20 }]}>
        Current color: {bgColor}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  text: {
    textAlign: "center",
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    marginVertical: 4,
  },
});
