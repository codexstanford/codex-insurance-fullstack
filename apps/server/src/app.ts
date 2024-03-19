// https://expressjs.com/en/starter/hello-world.html

import express from "express";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Serving server app on http://localhost:${port}`);
});
