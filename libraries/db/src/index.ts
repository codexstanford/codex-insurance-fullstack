// https://orm.drizzle.team/docs/get-started-sqlite#better-sqlite3

import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schemas from "schema";
import { DB_PATH } from "../const";

const sqlite = new Database(DB_PATH);

export const db = drizzle(sqlite, { schema: { ...schemas } });

export * from "drizzle-orm";
