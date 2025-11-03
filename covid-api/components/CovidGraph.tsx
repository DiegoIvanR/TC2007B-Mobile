import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { HistoricalDataPoint } from "../types/api"; // Importamos nuestro tipo

interface CovidGraphProps {
  data: HistoricalDataPoint[];
}

const screenWidth = Dimensions.get("window").width;

// Configuración visual de la gráfica
const chartConfig = {
  backgroundColor: "#f8f9fa",
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(217, 83, 79, ${opacity})`, // Color rojo
  labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: "4",
    strokeWidth: "2",
    stroke: "#d9534f",
  },
};

/**
 * Helper para parsear de forma segura una fecha en formato "M/D/YY".
 */
const parseApiDate = (dateString: string): Date => {
  if (!dateString) return new Date(); // Fallback por si acaso
  const parts = dateString.split("/"); // ["1", "22", "20"]
  // parts[0] = Mes (1-indexado), parts[1] = Día, parts[2] = Año (2-dígitos)
  // El constructor de Date usa mes 0-indexado (0 = Enero)
  return new Date(
    Number(`20${parts[2]}`),
    Number(parts[0]) - 1,
    Number(parts[1])
  );
};

const CovidGraph: React.FC<CovidGraphProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          No hay datos históricos disponibles.
        </Text>
      </View>
    );
  }

  const maxLabels = 8; // Menos etiquetas para pantallas móviles
  const step = Math.max(1, Math.floor(data.length / maxLabels));

  const labels = data
    .filter((_, index) => index % step === 0)
    .map((item) => {
      const date = parseApiDate(item.Date); // Usamos el helper seguro

      const year = String(date.getUTCFullYear()).slice(-2); // Obtiene los últimos 2 dígitos del año (ej. "21")
      return `${date.getUTCMonth() + 1}/${year}`; // Formato "M/D/AA"
    });

  const casesData = data
    .filter((_, index) => index % step === 0)
    .map((item) => item.Cases);

  // Asegurarnos de que las etiquetas y los datos no estén vacíos
  if (labels.length === 0 || casesData.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Datos insuficientes para la gráfica.
        </Text>
      </View>
    );
  }

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: casesData,
        color: (opacity = 1) => `rgba(217, 83, 79, ${opacity})`, // Color de la línea
        strokeWidth: 2,
      },
    ],
    legend: ["Confirmados"],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Casos Confirmados</Text>
      <LineChart
        data={chartData}
        width={screenWidth - 32} // Ancho total menos el padding del contenedor
        height={250}
        chartConfig={chartConfig}
        bezier // Líneas curvas
        style={styles.chart}
        // Formateador para el eje Y (ej. 100k, 1M)
        formatYLabel={(yValue) => {
          const num = Number(yValue);
          if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
          if (num >= 1000) return `${(num / 1000).toFixed(0)}k`;
          return num.toString();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  errorText: {
    fontSize: 14,
    color: "#888",
    padding: 20,
  },
});

export default CovidGraph;
