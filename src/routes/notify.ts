import { z } from "zod";
import type { Request, Response } from "express";
import { sensors } from "../utils/enums";
import { prisma } from "../database";

export async function get(_req: Request, res: Response) {
  res.render("notify");
}

const notifyBodySchema = z.object({
  sensor: z.enum(sensors),
  cenario: z.string(),
  valor: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : null)),
  email: z.string().email(),
});

export async function post(req: Request, res: Response) {
  const { cenario, email, sensor, valor } = notifyBodySchema.parse(req.body);

  await prisma.notification.create({
    data: {
      email,
      scenario: cenario,
      sensor,
      value: valor,
    },
  });

  res.render("notifyConfirm");
}

export const notify = { get, post };
