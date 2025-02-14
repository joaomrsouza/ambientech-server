export const sensors = [
  "temperature",
  "humidity",
  "rain",
  "qoa",
  "smoke",
] as const;
export type Sensor = (typeof sensors)[number];

export const operators = ["=", "!=", "<", ">", "<=", ">="] as const;
export type Operator = (typeof operators)[number];
