import { PrismaClient } from "@prisma/client";
import { getNewProfile } from "./__tests__/fixtures";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();
