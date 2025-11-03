import { CountrySummary, HistoricalDataPoint } from "../types/api";

// Cambiado a la API de disease.sh que tiene CORS abierto y funciona bien
const BASE_URL = "https://disease.sh/v3/covid-19";

/**
 * Modelo: Obtiene los datos resumidos de todos los países.
 */
export const fetchSummary = async (): Promise<CountrySummary[]> => {
  try {
    const response = await fetch(`${BASE_URL}/countries`);
    if (!response.ok) {
      throw new Error("Error al obtener el resumen de datos");
    }
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("fetchSummary Error:", error);
    throw error;
  }
};

/**
 * Modelo: Obtiene el historial de casos confirmados para un país específico.
 */
export const fetchHistoricalData = async (
  countryName: string
): Promise<HistoricalDataPoint[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/historical/${countryName}?lastdays=all`
    );
    if (!response.ok) {
      throw new Error("Error al obtener datos históricos del país");
    }
    const data = await response.json();

    if (!data.timeline || !data.timeline.cases) {
      // Manejar casos donde un país no tiene datos históricos
      return [];
    }

    // Transformar el objeto timeline.cases en un array
    const timeline = data.timeline.cases;
    const transformedData: HistoricalDataPoint[] = Object.keys(timeline).map(
      (date) => ({
        // --- LA CORRECCIÓN ESTÁ AQUÍ ---
        // Simplemente pasamos el string de fecha (ej. "1/22/20")
        // sin intentar convertirlo con 'new Date()'.
        Date: date,
        Cases: timeline[date],
      })
    );

    return transformedData;
  } catch (error) {
    // Este es el error que viste en la captura
    console.error("fetchHistoricalData Error:", error);
    throw error;
  }
};
