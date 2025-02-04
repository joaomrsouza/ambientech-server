import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../database";

const sensors = ["temperature", "humidity", "rain", "qoa", "smoke"] as const;
type Sensor = (typeof sensors)[number];

const dataSchema = z.object({
  sensor: z.enum(sensors),
  data: z.array(
    z.object({
      timestamp: z.string().pipe(z.coerce.date()),
      value: z.number(),
    })
  ),
});

export async function register(req: Request, res: Response) {
  try {
    if (req.headers["x-access-token"] !== process.env.ESP_TOKEN) {
      res.sendStatus(401);
      return;
    }

    const receivedData = dataSchema.parse(req.body);

    const handlers: Record<Sensor, () => Promise<void>> = {
      temperature: async () => {
        await prisma.temperatureData.createMany({
          data: receivedData.data,
        });
      },
      humidity: async () => {
        await prisma.humidityData.createMany({
          data: receivedData.data,
        });
      },
      qoa: async () => {
        await prisma.qOAData.createMany({
          data: receivedData.data,
        });
      },
      rain: async () => {
        await prisma.rainData.createMany({
          data: receivedData.data,
        });
      },
      smoke: async () => {
        await prisma.smokeData.createMany({
          data: receivedData.data,
        });
      },
    };

    await handlers[receivedData.sensor]();

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(400);
  }
}
