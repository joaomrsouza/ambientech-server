import type { Request, Response } from "express";
import { prisma } from "../database";

export async function root(_req: Request, res: Response) {
  const tempData = await prisma.temperatureData.findMany();

  res.render("root", { tempData });
}
