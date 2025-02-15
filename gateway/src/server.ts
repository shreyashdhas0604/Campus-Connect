import express from "express";

const app = express();

const port = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Gateway is running!");
});

app.listen(port, () => {
  console.log(`Gateway Server started on port ${port}`);
});

