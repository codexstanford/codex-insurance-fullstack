import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import { basicUserInfoSchema } from "./common";

// https://www.passportjs.org/reference/normalized-profile/

export const profiles = sqliteTable("profiles", {
  id: integer("id").primaryKey(),

  provider: text("provider"),
  idAtProvider: text("idAtProvider"),

  ...basicUserInfoSchema,

  userId: integer("userId").references(() => users.id),
});

// https://orm.drizzle.team/docs/rqb

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}));
