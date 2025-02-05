import type { Request, Response } from "express";
import { prisma } from "../database";
import { subHours } from "date-fns";

export async function root(_req: Request, res: Response) {
  const hj = new Date();
  const hjm3 = subHours(hj, 3);
  const hjm300 = new Date(hjm3.setHours(0, 0, 0, 0));
  console.log(
    JSON.stringify(
      {
        hj,
        hjm3,
        hjm300,
        hjm300String: hjm300.toString(),
        hjm300ISO: hjm300.toISOString(),
      },
      null,
      2
    )
  );

  const dateFromServer = new Date(); // California midnight
  const serverOffset = new Date().getTimezoneOffset(); // in minutes, from that API call
  const serverOffsetMillis = 60 * 1000 * serverOffset;
  const localOffset = -60 * 3; // in minutes
  const localOffsetMillis = 60 * 1000 * localOffset;
  const localMidnight = new Date(
    dateFromServer.getTime() - serverOffsetMillis + localOffsetMillis
  );
  console.log(
    JSON.stringify(
      {
        dateFromServer,
        serverOffset,
        serverOffsetMillis,
        localOffset,
        localOffsetMillis,
        localMidnight,
        localMidnightString: localMidnight.toString(),
      },
      null,
      2
    )
  );

  const localDate = new Date(
    new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .replace("z", "+03:00")
  ).toISOString();
  const today = localDate.split("T")[0]! + "T00:00:00.000";

  const yesterday = new Date(
    new Date(today).setDate(new Date(today).getDate() - 1)
  );

  const correctedDate =
    process.env.NODE_ENV === "production" ? yesterday : today;

  const where = {
    timestamp: {
      gte: new Date(today),
      lt: new Date(new Date(today).setDate(new Date(today).getDate() + 1)),
    },
    value: { not: 0 },
  };

  console.log(
    JSON.stringify(
      {
        localDate,
        today,
        correctedDate,
        where,
        dateToday: new Date(localDate.replace("Z", "+03:00")),
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
