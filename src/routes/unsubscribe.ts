import type { Request, Response } from "express";
import { prisma } from "../database";

export async function get(req: Request, res: Response) {
  res.render("unsubscribe", { email: req.params.email });
}

export async function post(req: Request, res: Response) {
  await prisma.notification.deleteMany({ where: { email: req.body.email } });

  res.render("unsubscribeConfirm");
}

export const unsubscribe = { get, post };
