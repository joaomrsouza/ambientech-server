import type { Request, Response } from "express";
import { prisma } from "../database";

export async function root(_req: Request, res: Response) {
  const localDate = new Date(
    Date.now() - new Date().getTimezoneOffset() * 60000
  ).toISOString();
  const today =
    localDate.split("T")[0]! +
    `T00:00:00.000-${
      process.env.NODE_ENV === "production" ? "00:00" : "03:00"
    }`;

  const where = {
    timestamp: {
      gte: new Date(today),
      lt: new Date(new Date(today).setDate(new Date(today).getDate() + 1)),
    },
    value: { not: 0 },
  };

  console.log(JSON.stringify(where, null, 2));

  const [temperatureData, humidityData, rainData, qOAData, smokeData] =
    await Promise.all([
      prisma.temperatureData.findMany({ where }),
      prisma.humidityData.findMany({ where }),
      prisma.rainData.findMany({ where }),
      prisma.qOAData.findMany({ where }),
      prisma.smokeData.findMany({ where }),
    ]);

  res.render("root", {
    sensorData: {
      temperatureData,
      humidityData,
      rainData,
      qOAData,
      smokeData,
    },
  });
}
