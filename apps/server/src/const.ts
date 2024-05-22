import path from "path";

export const BUILD_FOLDER =
  process.env.NODE_ENV === "production"
    ? path.join(__dirname, "./")
    : path.join(__dirname, "../../../build/");

export const VAR_FOLDER =
  process.env.NODE_ENV === "production"
    ? path.join(__dirname, "../var/")
    : path.join(__dirname, "../../../var/");
