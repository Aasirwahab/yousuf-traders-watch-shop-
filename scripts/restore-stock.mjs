// Test helper: give any out-of-stock product headroom so checkout can be tested
// repeatedly (each placed order reserves 1 unit). Not for production.
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

const low = await prisma.product.findMany({ where: { stock: { lt: 5 } }, select: { slug: true, stock: true } });
const { count } = await prisma.product.updateMany({ where: { stock: { lt: 5 } }, data: { stock: 5 } });

console.log(`Restored ${count} product(s) to stock 5:`);
for (const p of low) console.log(`  ${p.slug}: ${p.stock} -> 5`);
await prisma.$disconnect();
