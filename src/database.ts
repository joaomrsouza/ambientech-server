import { type Express } from "express";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export async function databaseConnect(app: Express) {
  console.log("Connecting to database");
  await prisma.$connect();
  console.log("Database connected");
  app.emit("ready");
}
