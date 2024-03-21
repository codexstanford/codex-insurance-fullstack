// https://expressjs.com/en/starter/hello-world.html

import "dotenv/config";
import express from "express";
import path from "path";
import addAuthMiddleware from "./auth/addAuthMiddleware";
import authRouter from "./routers/auth";

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

app.use("/api/auth", authRouter);

// Handles any requests that don't match the ones above and forwards them to the React app
app.get("*", (_, res) => {
  res.sendFile(path.join(pathToClient, "index.html"));
});

/* -------------------------------------------------------------------------- */
/*                                Start server                                */
/* -------------------------------------------------------------------------- */

app.listen(port, () => {
  console.log(`Serving server app on http://localhost:${port}`);
});
