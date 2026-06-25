import { defineConfig } from "eslint/config";
import next from "eslint-config-next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([
  {
    // Generated Prisma client — not our source, don't lint it.
    ignores: ["generated/**"],
  },
  {
    extends: [...next],
  },
]);
