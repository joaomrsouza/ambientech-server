export const sensors = [
  "temperature",
  "humidity",
  "rain",
  "qoa",
  "smoke",
] as const;
export type Sensor = (typeof sensors)[number];

export const sensorTextMap: Record<Sensor, string> = {
  humidity: "Umidade",
  qoa: "Qualidade do ar",
  rain: "Chuva",
  smoke: "Fumaça",
  temperature: "Temperatura",
};

export const operators = ["=", "!=", "<", ">", "<=", ">="] as const;
export type Operator = (typeof operators)[number];
