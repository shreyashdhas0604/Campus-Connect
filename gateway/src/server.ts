import express from "express";

const app = express();

const port = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Gateway is running!");
});

app.get('/api/health', (req, res) => {
  res.sendStatus(200).send('Gateway is healthy!');
});

app.listen(port, () => {
  console.log(`Gateway Server started on port ${port}`);
});

