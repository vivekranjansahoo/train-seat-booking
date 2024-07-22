import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cron from "node-cron";
import { spawn } from "child_process";

// security packages
import helmet from "helmet";
import { xss } from "express-xss-sanitizer";
import bodyParser from "body-parser";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";

import trainRouter from "./routes/train.js";
import authRouter from "./routes/authRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

// Using CORS
// app.use(
//   cors({
//     origin: [process.env.API_URL, "http://localhost:3001"],
//   })
// );

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// security middlewares
app.use(helmet()); // general security
app.use(xss()); // xss protection
app.use(mongoSanitize()); // sanitization for mongodb
app.use(cookieParser()); // parsing cookies

// Connect to the MongoDB database
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("[DB] Connection Success");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api/train", trainRouter);
app.use("/api/auth", authRouter);

app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

cron.schedule(
  "42 0 * * *",
  () => {
    console.log("Running seed.js file");
    const seed = spawn("node", ["seed.js"]);

    seed.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    seed.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    seed.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
    });
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata", // Set timezone to IST
  }
);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
