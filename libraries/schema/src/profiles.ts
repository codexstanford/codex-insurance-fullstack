import { relations } from "drizzle-orm";
import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import { basicUserInfoSchema } from "./common";

// https://www.passportjs.org/reference/normalized-profile/

export const profiles = sqliteTable(
  "profiles",
  {
    id: integer("id").primaryKey(),

    provider: text("provider").notNull(),
    idAtProvider: text("idAtProvider").notNull(),

    userId: integer("userId")
      .references(() => users.id)
      .notNull(),

    ...basicUserInfoSchema,
  },
  (t) => ({
    unq: unique().on(t.provider, t.idAtProvider),
  }),
);

// https://orm.drizzle.team/docs/rqb

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}));
