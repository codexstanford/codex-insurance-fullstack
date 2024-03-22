// https://expressjs.com/en/starter/hello-world.html

import "dotenv/config";
import express from "express";
import path from "path";
import addAuthMiddleware from "./auth/addAuthMiddleware";
import authRouter from "./api/auth";
import { CLIENT_SESSION_USER_WINDOW_FIELD, ROUTES } from "common";
import { renderFile } from "ejs";

/* -------------------------------------------------------------------------- */
/*                                   Config                                   */
/* -------------------------------------------------------------------------- */

const port = 3000;
const pathToClient = path.join(__dirname, "../../react/build");

/* -------------------------------------------------------------------------- */
/*                                   Express                                  */
/* -------------------------------------------------------------------------- */

const app = express();

// Serve the static files from the React app
app.use(express.static(pathToClient));

addAuthMiddleware(app);

app.use(ROUTES.API_AUTH, authRouter);

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
  console.log(`Serving server app on http://localhost:${port}`);
});
