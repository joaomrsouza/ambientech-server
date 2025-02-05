import type { Request, Response } from "express";
import { prisma } from "../database";
import { addDays, setHours, subDays, subHours } from "date-fns";

export async function root(_req: Request, res: Response) {
  // const correctedDate =
  const today = new Date(
    subHours(
      new Date().setHours(0, 0, 0, 0),
      new Date().getTimezoneOffset() / 60
    )
  );

  const where = {
    timestamp: {
      gte: today,
      lt: addDays(today, 1), // new Date(today.setDate(today.getDate() + 1)),
    },
    value: { not: 0 },
  };

  console.log(
    JSON.stringify(
      {
        env: process.env.NODE_ENV,
        // correctedDate,
        today,
        where,
        localOffset: new Date().getTimezoneOffset(),
      },
      null,
      2
    )
  );

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
