import { Prisma as PrismaDefault, PrismaClient } from "@prisma/client";
export const db = new PrismaClient();
export const Prisma = PrismaDefault;
