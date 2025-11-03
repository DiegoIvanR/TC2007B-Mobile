// Este archivo es importado por 'index.tsx' y 'CovidGraph.tsx'

export interface CountrySummary {
  country: string;
  countryInfo: {
    iso2: string;
    iso3: string;
    flag: string; // La API sí incluye la bandera
  };
  cases: number;
  todayCases: number;
  deaths: number;
  todayDeaths: number;
  recovered: number;
  todayRecovered: number;
  updated: number;
}

export interface HistoricalDataPoint {
  Date: string; // <-- Esta es la fecha en formato "M/D/YY"
  Cases: number;
}
