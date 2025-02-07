import { addDays, subHours } from "date-fns";
import type { Request, Response } from "express";
import { prisma } from "../../database";

export async function query(_req: Request, res: Response) {
  // TODO: Deve receber um parâmetro de dia para consulta

  const today = new Date(
    subHours(
      new Date(subHours(new Date(), 3).setHours(0, 0, 0, 0)),
      new Date().getTimezoneOffset() / 60
    )
  );

  const where = {
    timestamp: {
      gte: today,
      lt: addDays(today, 1),
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

  res.json({
    sensorData: {
      temperatureData,
      humidityData,
      rainData,
      qOAData,
      smokeData,
    },
  });
}
