import type { Request, Response } from "express";

export function health(_req: Request, res: Response) {
  res.sendStatus(200);
}
