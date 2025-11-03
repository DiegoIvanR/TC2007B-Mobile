import React, { useState, useEffect, useMemo } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  FlatList, // Importamos FlatList
  TouchableOpacity, // Para hacer items clickables
  Image, // Para mostrar la bandera
  Button, // Para el botón de "Volver"
} from "react-native";
import { Stack } from "expo-router";
import { CountrySummary, HistoricalDataPoint } from "../../types/api";
import { fetchSummary, fetchHistoricalData } from "../../services/covidApi";
import CovidGraph from "../../components/CovidGraph";

// --- VISTA (Componente de Tarjeta de Estadística) ---
const StatCard: React.FC<{ label: string; value: number; color: string }> = ({
  label,
  value,
  color,
}) => (
  <View style={styles.statCard}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={[styles.statValue, { color }]}>
      {(value || 0).toLocaleString("en-US")}
    </Text>
  </View>
);

// --- VISTA (Componente de Item de la Lista de Países) ---
// Nuevo componente para renderizar cada país en la lista
const CountryListItem: React.FC<{
  item: CountrySummary;
  onPress: () => void;
}> = ({ item, onPress }) => {
  // Accedemos a la bandera. La API la provee aunque no la hayamos tipado explícitamente.
  // Usamos '(item.countryInfo as any).flag' para respetar la regla de no cambiar types/api.ts
  const flagUrl = (item.countryInfo as any).flag;

  return (
    <TouchableOpacity onPress={onPress} style={styles.listItem}>
      <Image source={{ uri: flagUrl }} style={styles.flag} />
      <View style={styles.listItemText}>
        <Text style={styles.listItemTitle}>{item.country}</Text>
        <Text style={styles.listItemSubtitle}>
          Contagiados: {item.cases.toLocaleString("en-US")}
        </Text>
      </View>
      <Text style={styles.listItemArrow}>{">"}</Text>
    </TouchableOpacity>
  );
};

// --- CONTROLADOR Y VISTA PRINCIPAL (Componente App) ---
export default function App() {
  // --- ESTADO (Parte del Controlador) ---
  const [searchQuery, setSearchQuery] = useState(""); // Para filtrar la lista
  const [allCountries, setAllCountries] = useState<CountrySummary[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<CountrySummary | null>(
    null
  );
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>(
    []
  );

  // Estados de carga separados
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // --- LÓGICA (Parte del Controlador) ---

  // Cargar todos los países al iniciar la app
  useEffect(() => {
    const loadAllCountries = async () => {
      try {
        setError(null);
        setIsLoadingList(true);
        const summaryData = await fetchSummary();
        // Ordenamos por más casos
        summaryData.sort((a, b) => b.cases - a.cases);
        setAllCountries(summaryData);
      } catch (err) {
        setError("No se pudo cargar la lista de países.");
        console.error(err);
      } finally {
        setIsLoadingList(false);
      }
    };

    loadAllCountries();
  }, []); // El array vacío asegura que se ejecute solo una vez

  // Filtrar países basados en la búsqueda (se ejecuta solo cuando cambia la lista o la búsqueda)
  const filteredCountries = useMemo(() => {
    if (!searchQuery) return allCountries;

    const queryLower = searchQuery.toLowerCase();
    return allCountries.filter((country) =>
      country.country.toLowerCase().includes(queryLower)
    );
  }, [allCountries, searchQuery]);

  // Manejador para cuando se selecciona un país de la lista
  const handleSelectCountry = async (country: CountrySummary) => {
    setSelectedCountry(country); // Mostramos la vista de detalle
    setIsLoadingDetails(true);
    setError(null);
    setHistoricalData([]); // Limpiamos datos anteriores

    try {
      // Buscamos solo los datos históricos
      const history = await fetchHistoricalData(country.country);
      setHistoricalData(history);
    } catch (err) {
      setError("No se pudieron cargar los datos históricos.");
      console.error(err);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Manejador para volver a la lista
  const handleClearSelection = () => {
    setSelectedCountry(null);
    setHistoricalData([]);
    setError(null);
  };

  // --- RENDERIZADO (Vistas Condicionales) ---

  // VISTA 1: Lista de Países (si no hay país seleccionado)
  const renderCountryList = () => (
    <View style={styles.fullFlex}>
      <Stack.Screen
        options={{
          title: "Monitor COVID-19",
          headerLargeTitle: true,
          headerStyle: { backgroundColor: "#f8f8f8" },
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Filtrar país..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {isLoadingList ? (
        <ActivityIndicator size="large" color="#007aff" style={styles.loader} />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredCountries}
          keyExtractor={(item) => item.countryInfo.iso3 || item.country}
          renderItem={({ item }) => (
            <CountryListItem
              item={item}
              onPress={() => handleSelectCountry(item)}
            />
          )}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );

  // VISTA 2: Detalle del País (si hay un país seleccionado)
  const renderCountryDetail = () => (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen
        options={{
          title: selectedCountry!.country, // Título dinámico
          headerLargeTitle: false,
        }}
      />
      <Button title="< Volver a la lista" onPress={handleClearSelection} />

      <View style={styles.resultsSection}>
        <Text style={styles.countryTitle}>{selectedCountry!.country}</Text>

        <View style={styles.statsGrid}>
          <StatCard
            label="Total Confirmados"
            value={selectedCountry!.cases}
            color="#d9534f"
          />
          <StatCard
            label="Total Muertes"
            value={selectedCountry!.deaths}
            color="#333333"
          />
          <StatCard
            label="Total Recuperados"
            value={selectedCountry!.recovered}
            color="#5cb85c"
          />
          <StatCard
            label="Nuevos Confirmados"
            value={selectedCountry!.todayCases}
            color="#f0ad4e"
          />
        </View>

        {isLoadingDetails ? (
          <ActivityIndicator
            size="large"
            color="#007aff"
            style={styles.loader}
          />
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <CovidGraph data={historicalData} />
        )}
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Renderizado condicional principal */}
      {selectedCountry ? renderCountryDetail() : renderCountryList()}
    </SafeAreaView>
  );
}

// --- ESTILOS (StyleSheet) ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  fullFlex: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingBottom: 48,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 48,
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    margin: 16,
    backgroundColor: "#ffffff",
    fontSize: 16,
  },
  loader: {
    marginTop: 40,
  },
  errorContainer: {
    marginTop: 20,
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: "#f8d7da",
    borderRadius: 8,
  },
  errorText: {
    color: "#721c24",
    textAlign: "center",
    fontSize: 16,
  },
  resultsSection: {
    marginTop: 16,
  },
  countryTitle: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
    color: "#222",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    width: "48%",
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
    textAlign: "center",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
  },
  // Nuevos estilos para la lista
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  flag: {
    width: 50,
    height: 34,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#eee",
    marginRight: 16,
  },
  listItemText: {
    flex: 1, // Ocupa el espacio disponible
  },
  listItemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  listItemSubtitle: {
    fontSize: 14,
    color: "#d9534f", // Color rojo para casos
    marginTop: 4,
  },
  listItemArrow: {
    fontSize: 20,
    color: "#ccc",
  },
});
