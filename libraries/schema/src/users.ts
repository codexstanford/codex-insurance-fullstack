import { relations } from "drizzle-orm";
import { integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { basicUserInfoSchema } from "./common";
import { profiles } from "./profiles";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  ...basicUserInfoSchema,
});

// https://orm.drizzle.team/docs/rqb

export const usersRelations = relations(users, ({ many }) => ({
  profiles: many(profiles),
}));
