import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { basicUserInfoSchema } from "./common";
import { profiles } from "./profiles";

// NOTICE
// If you change this, make sure to also change the Express.User interface in apps/server/src/auth/addAuthMiddleware.ts

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  ...basicUserInfoSchema,
  email: text("email").unique(),
  epilogDataset: text("epilogDataset"),
});

// https://orm.drizzle.team/docs/rqb

export const usersRelations = relations(users, ({ many }) => ({
  profiles: many(profiles),
}));
