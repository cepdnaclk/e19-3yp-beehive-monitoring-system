import express from "express";
import { router as userRouter } from "../routes/userRoute.js";
import {router as beehiveRouter} from "../routes/beehiveRoute.js";

export function createServer() {
  const app = express();

  app.use(express.json());

  app.use("/api/user", userRouter);
  app.use ("/api/beehive", beehiveRouter);

  return app;
}
