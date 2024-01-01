import supertest from "supertest";
import { createServer } from "../utils/server.js";
import mongoose from "mongoose";
import { mongoURL } from "../config/dbconfig.js";
import { User } from "../models/userModel.js";
import { MongoMemoryServer } from "mongodb-memory-server";

const app = createServer();
beforeAll(async () => {
  // Create a in memory server
  const mongoServer = await MongoMemoryServer.create();
  // Get the connection string
  const mongoUri = mongoServer.getUri();
  // Connect to the in memory server
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
});

var userID = 1;

//TEST FLOW
// 1. Verify there are no users in the database
// 2. Create a user
// 3. Verify the user was created
// 4. Update the user
// 5. Verify the user was updated
// 6. Delete the user
// 7. Verify the user was deleted
// 8. Verify there are no users in the database

describe("User API", () => {
  it("should create a user", async () => {
    const user = {
      username: "Test User",
      email: "testemail@example.com",
      password: "testpassword",
    };
    const res = await supertest(app).post("/api/user").send(user);
    console.log(res.body);
    userID = res.body._id;
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.username).toBe(user.username);
    expect(res.body.email).toBe(user.email);
  });
  it("should get all users", async () => {
    const res = await supertest(app).get("/api/user");
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
  });
  it("should get a user", async () => {
    //put userID var as the ID of the user
    const res = await supertest(app).get("/api/user/" + userID);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.username).toBe("Test User");
    expect(res.body.email).toBe("testemail@example.com");
    expect(res.body.password).toBe("testpassword");
  });
  it("should update a user", async () => {
    const user = {
      username: "Updated User",
      email: "updatedtestemail@example.com",
      password: "updatedtestpassword",
    };
    const res = await supertest(app)
      .put("/api/user/" + userID)
      .send(user);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.username).toBe(user.username);
    expect(res.body.email).toBe(user.email);
    expect(res.body.password).toBe(user.password);
  });
  it("should delete a user", async () => {
    const res = await supertest(app).delete("/api/user/" + userID);
    expect(res.statusCode).toEqual(200);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("User removed");
  });
  it("should get no users", async () => {
    const res = await supertest(app).get("/api/user");
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(0);
  });
});
