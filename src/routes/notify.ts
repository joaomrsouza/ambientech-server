import type { Request, Response } from "express";

export async function notify(_req: Request, res: Response) {
  console.log("Notify");
  res.sendStatus(200);
}
