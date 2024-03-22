// https://expressjs.com/en/starter/hello-world.html

import "dotenv/config";
import express from "express";
import path from "path";
import addAuthMiddleware from "./auth/addAuthMiddleware";
import authRouter from "./api/auth";
import { ROUTES } from "common";
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
  renderFile(
    path.join(__dirname, "index.html"),
    {
      sessionScriptTag: req.user
        ? `<script>window.session = ${JSON.stringify(req.user)};</script>`
        : "",
    },
    { escape: (input) => input },
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
