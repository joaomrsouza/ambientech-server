import type { Request, Response } from "express";

export function notFound(_req: Request, res: Response) {
  res.render("not-found");
}
