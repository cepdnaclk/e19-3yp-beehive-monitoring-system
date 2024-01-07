import express from "express";
import { router as userRouter } from "../routes/userRoute.js";
import { router as beehiveRouter } from "../routes/beehiveRoute.js";
import { router as beehiveMetricsRouter } from "../routes/beehiveMetricsRoute.js";
import { router as cameraRecordRouter } from "../routes/cameraRecordRoute.js";
import { router as landingPageRoute } from "../routes/landingPageRoute.js";
import cors from "cors";

export function createServer() {
  const app = express();

  app.use(express.json());

  app.use(
    cors({
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  app.use("/api/user", userRouter);
  app.use("/api/beehive", beehiveRouter);
  app.use("/api/beehive-metrics", beehiveMetricsRouter);
  app.use("/api/camera", cameraRecordRouter);
  app.use("/", landingPageRoute);
  app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

  return app;
}
