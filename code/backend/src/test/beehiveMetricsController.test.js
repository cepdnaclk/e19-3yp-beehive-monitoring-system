import supertest from "supertest";
import { createServer } from "../utils/server.js";
import mongoose from "mongoose";

import { User } from "../models/userModel.js";
import { Beehive } from "../models/beehiveModel.js";
import { MongoMemoryServer } from "mongodb-memory-server";
import dotenv from "dotenv/config.js";
import { BeehiveMetrics } from "../models/beehiveMetricsModel.js";
import jwt from "jsonwebtoken";
const app = createServer();

beforeAll(async () => {
  jest.setTimeout(1000000);
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe("Beehive Metrics API", () => {
  let savedBeehiveMetricsId;

  it("should add new beehive metrics", async () => {
    const beehiveMetricsData = {
      beehive_id: "beehiveIdHere",
      CO2: "400 ppm",
      Temperature: "35°C",
      Humidity: "60%",
      Weight: "15kg",
      Battery_level: "90%",
    };

    const response = await supertest(app)
      .post("/api/beehive-metrics")
      .send(beehiveMetricsData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("_id");
    savedBeehiveMetricsId = response.body._id;
  });

  it("should get all beehive metrics", async () => {
    const response = await supertest(app).get("/api/beehive-metrics");
    expect(response.status).toBe(200);
    expect(response.body.beehiveMetrics).toBeDefined();
    // Perform other checks as needed based on the returned data
  });

  it("should get beehive metrics by ID", async () => {
    const response = await supertest(app).get(
      `/api/beehive-metrics/${savedBeehiveMetricsId}`
    );
    expect(response.status).toBe(200);
    expect(response.body._id).toBe(savedBeehiveMetricsId);
    // Perform other checks based on the returned data
  });

  it("should update beehive metrics", async () => {
    const updatedMetrics = {
      CO2: "450 ppm",
      Temperature: "30°C",
      Humidity: "65%",
      Weight: "20kg",
      Battery_level: "85%",
    };

    const response = await supertest(app)
      .put(`/api/beehive-metrics/${savedBeehiveMetricsId}`)
      .send(updatedMetrics);

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(savedBeehiveMetricsId);
    // Perform other checks based on the returned data
  });

  it("should delete beehive metrics", async () => {
    const response = await supertest(app).delete(
      `/api/beehive-metrics/${savedBeehiveMetricsId}`
    );

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Beehive metrics deleted successfully");
  });
});
