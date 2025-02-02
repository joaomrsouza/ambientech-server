import type { Request, Response } from "express";
import { prisma } from "../database";

export async function root(_req: Request, res: Response) {
  const today = new Date().toISOString().split("T")[0]! + "T00:00";
  const ontem =
    new Date(new Date(today).setDate(new Date(today).getDate() - 1))
      .toISOString()
      .split("T")[0]! + "T00:00";

  const where = {
    timestamp: {
      gte: new Date(ontem),
      lt: new Date(new Date(ontem).setDate(new Date(ontem).getDate() + 1)),
    },
    value: { not: 0 },
  };

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
