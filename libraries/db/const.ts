import path from "path";

export const DB_PATH =
  process.env.NODE_ENV === "production"
    ? path.join(__dirname, "../var/db.sqlite")
    : path.join(__dirname, "../../var/db.sqlite");
