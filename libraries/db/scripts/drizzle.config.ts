import type { Config } from "drizzle-kit";
import { DB_PATH } from "../const";

export default {
  schema: "../schema/src/index.ts",
  out: "./drizzle",
  driver: "better-sqlite", // 'pg' | 'mysql2' | 'better-sqlite' | 'libsql' | 'turso'
  dbCredentials: {
    url: DB_PATH, // 👈 this could also be a path to the local sqlite file
  },
} satisfies Config;
