// https://expressjs.com/en/starter/hello-world.html

import path from "path";
import { BUILD_FOLDER } from "./const";
import { config } from "dotenv";

config({ path: path.join(BUILD_FOLDER, "../.env") });

import { CLIENT_SESSION_USER_WINDOW_FIELD, ROUTES } from "common";
import { renderFile } from "ejs";
import express from "express";
import authRouter from "./api/auth";
import userDatasetRouter from "./api/userDataset";
import addAuthMiddleware from "./auth/addAuthMiddleware";

/* -------------------------------------------------------------------------- */
/*                                   Config                                   */
/* -------------------------------------------------------------------------- */

const port = process.env.NODE_ENV === "production" ? 80 : 3000;

const pathToClient = path.join(BUILD_FOLDER, "./react");

/* -------------------------------------------------------------------------- */
/*                                   Express                                  */
/* -------------------------------------------------------------------------- */

const app = express();

// Serve the static files from the React app
app.use(express.static(pathToClient));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

addAuthMiddleware(app);

app.use(ROUTES.API_AUTH, authRouter);
app.use(ROUTES.API_USER_DATASET, userDatasetRouter);

// Handles any requests that don't match the ones above and forwards them to the React app
app.get("*", (req, res, next) => {
  // Replaces "<%= sessionScriptTag %>" in index.html with the user session, if it exists, otherwise, with an empty string
  renderFile(
    path.join(__dirname, "index.html"),
    {
      sessionScriptTag: req.user
        ? `<script>window["${CLIENT_SESSION_USER_WINDOW_FIELD}"] = ${JSON.stringify(req.user)};</script>`
        : "",
    },
    { escape: (input) => input }, // Don't escape what shall be inserted for "<%= sessionScriptTag %>"
    (err, str) => {
      if (err) return next(err);
      res.send(str);
    },
  );
});

/* -------------------------------------------------------------------------- */
/*                                Start server                                */
/* -------------------------------------------------------------------------- */

app.listen(port, () => {
  console.log(
    process.env.NODE_ENV === "production"
      ? `Serving production server.`
      : `Serving server app on http://localhost:${port}`,
  );
});
