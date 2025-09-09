import dotenv from "dotenv";
import path from "path";
import { connectDB } from "./lib/db.js";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
  connectDB();
});
