import type { Request, Response } from "express";

export async function query(_req: Request, res: Response) {
  console.log("Query");
  res.sendStatus(200);
}
