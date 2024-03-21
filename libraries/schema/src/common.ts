import { text } from "drizzle-orm/sqlite-core";

export const basicUserInfoSchema = {
  displayName: text("displayName"),
  givenName: text("givenName"),
  middleName: text("middleName"),
  familyName: text("familyName"),

  email: text("email"),

  photoUrl: text("photoUrl"),
};
