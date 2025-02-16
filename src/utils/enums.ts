export const sensors = [
  "temperature",
  "humidity",
  "rain",
  "qoa",
  "smoke",
] as const;
export type Sensor = (typeof sensors)[number];
