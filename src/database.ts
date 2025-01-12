import { type Express } from "express";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export async function databaseConnect(app: Express) {
  await prisma.$connect();
  app.emit("ready");
}
