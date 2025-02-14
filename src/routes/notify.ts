import type { Request, Response } from "express";
import { jobService } from "../jobs";

export async function notify(_req: Request, res: Response) {
  console.log("Notify");
  jobService.getAgenda().now(jobService.notify.name, { teste: "alloooww" });
  res.sendStatus(200);
}
