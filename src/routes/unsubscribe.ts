import type { Request, Response } from "express";

export async function unsubscribe(_req: Request, res: Response) {
  console.log("Unsubscribe");
  res.sendStatus(200);
}
