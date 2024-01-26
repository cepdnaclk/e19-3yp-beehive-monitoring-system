import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { router as userRouter } from "../routes/userRoute.js";
import { router as beehiveRouter } from "../routes/beehiveRoute.js";
import { router as beehiveMetricsRouter } from "../routes/beehiveMetricsRoute.js";
import { router as cameraRecordRouter } from "../routes/cameraRecordRoute.js";
import { router as landingPageRoute } from "../routes/landingPageRoute.js";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import { options } from "./swagger.js";
import swaggerJSDoc from "swagger-jsdoc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

  try {
    const swaggerSpec = swaggerJSDoc(options);
    console.log("Swagger document loaded successfully.");
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  } catch (error) {
    console.error("Error loading Swagger document:", error);
  }
  app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

  return app;
}
