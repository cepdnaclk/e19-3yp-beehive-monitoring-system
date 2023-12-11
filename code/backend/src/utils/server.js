import express from "express";
import { router as userRouter } from "../routes/userRoute.js";

export function createServer() {
  const app = express();

  app.use(express.json());

  app.use("/api", userRouter);

  return app;
}
