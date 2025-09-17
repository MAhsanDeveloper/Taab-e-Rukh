import dotenv from "dotenv";
import path from "path";
import express from "express";
import { connectDB } from "./lib/db.js";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

await connectDB();

app.get(/.*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

const server = app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

const graceful = async () => {
  console.log("Shutting down gracefully...");
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("Forcefully shutting down.");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", graceful);
process.on("SIGINT", graceful);
