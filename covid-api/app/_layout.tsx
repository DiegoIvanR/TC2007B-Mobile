// app/_layout.tsx
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    // Requerido por react-native-chart-kit para gestos en la gráfica
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Monitor COVID-19",
            headerLargeTitle: true,
            headerStyle: { backgroundColor: "#f8f8f8" },
            headerTitleStyle: { fontWeight: "bold" },
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
