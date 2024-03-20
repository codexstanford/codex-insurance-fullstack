// https://expressjs.com/en/starter/hello-world.html

import express from "express";
import path from "path";

const app = express();
const pathToClient = path.join(__dirname, "../../react/build");

// Serve the static files from the React app
app.use(express.static(pathToClient));

// Handles any requests that don't match the ones above
app.get("*", (_, res) => {
  res.sendFile(path.join(pathToClient, "index.html"));
});

const port = 3000;

app.listen(port, () => {
  console.log(`Serving server app on http://localhost:${port}`);
});
