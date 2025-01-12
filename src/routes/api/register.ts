import type { Request, Response } from "express";

export async function register(_req: Request, res: Response) {
  console.log("Register");
  res.sendStatus(200);
}
