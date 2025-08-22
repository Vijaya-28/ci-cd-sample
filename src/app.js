import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello from CI/CD pipeline 👋");
});

app.get("/healthz", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
