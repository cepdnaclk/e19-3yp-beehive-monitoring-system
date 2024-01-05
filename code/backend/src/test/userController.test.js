import supertest from "supertest";
import { createServer } from "../utils/server.js";
import mongoose from "mongoose";

import { User } from "../models/userModel.js";
import { MongoMemoryServer } from "mongodb-memory-server";
import dotenv from "dotenv/config.js";
import jwt from "jsonwebtoken";

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
// 0. Should get an error when trying to create a user with wrong body
// 1. Should not create a user with invalid email
// 2. Should not create a user with invalid username
// 3. Should not create a user with invalid password
// 4. Should Create a user
// 5. Should Try to create a user again with the same email
// 6. Should Try to login by a non existing email
// 7. Should try to login with existing email and wrong password
// 8. Should try to login with correct email and password

describe("User API", () => {
  it("should get an error when trying to create a user with wrong body", async () => {
    const user = {
      username: "Test User",
      email: "testemail@example.com",
    };
    const res = await supertest(app).post("/api/user/register").send(user);
    //console.log(res.body);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("All fields are mandatory!");
  });
  it("should not create a user with invalid email", async () => {
    const user = {
      username: "Test User",
      email: "testemail",
      password: "testpassword",
    };
    const res = await supertest(app).post("/api/user/register").send(user);
    //console.log(res.body);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("Email is not valid");
  });
  it("should not create a user with invalid username", async () => {
    const user = {
      username: "TestUser2!",
      email: "testuser@example.com",
      password: "testpassword",
    };
    const res = await supertest(app).post("/api/user/register").send(user);
    //console.log(res.body);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("Username is not valid");
  });
  it("should not create a user with invalid password", async () => {
    const user = {
      username: "TestUser2",
      email: "testuser@example.com",
      password: "testpassword",
    };
    const res = await supertest(app).post("/api/user/register").send(user);
    //console.log(res.body);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("Password is not valid");
  });

  it("should create a user", async () => {
    const user = {
      username: "TestUser",
      email: "testemail@example.com",
      password: "Testpassword1@",
    };
    const res = await supertest(app).post("/api/user/register").send(user);
    //console.log(res.body);
    userID = res.body._id;
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.username).toBe(user.username);
    expect(res.body.email).toBe(user.email);
  });
  it("should try to create a user again with the same email", async () => {
    const user = {
      username: "TestUser2",
      email: "testemail@example.com",
      password: "Testnewpassword1@",
    };
    const res = await supertest(app).post("/api/user/register").send(user);
    //console.log(res.body);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("User already exists");
  });
  it("should try to login by a non existing email", async () => {
    const user = {
      email: "testemail2@example.com",
      password: "testpassword",
    };
    const res = await supertest(app).post("/api/user/login").send(user);
    //console.log(res.body);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("User not found");
  });
  it("should try to login with existing email and wrong password", async () => {
    const user = {
      email: "testemail@example.com",
      password: "testnewpassword",
    };
    const res = await supertest(app).post("/api/user/login").send(user);
    //console.log(res.body);
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("Incorrect password");
  });
  it("should try to login with correct email and password", async () => {
    const user = {
      email: "testemail@example.com",
      password: "Testpassword1@",
    };
    const res = await supertest(app).post("/api/user/login").send(user);
    console.log(res.body);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("accessToken");
    //check if the token is valid
    const token = res.body.accessToken;
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    //check that the token expires in 15 mins
    expect(decoded.exp - decoded.iat).toBe(900);
    //check that the token contains the user
    expect(decoded.user).toHaveProperty("username");
    expect(decoded.user).toHaveProperty("email");
    expect(decoded.user).toHaveProperty("id");
    expect(decoded.user.username).toBe("TestUser");
    expect(decoded.user.email).toBe("testemail@example.com");
    expect(decoded.user.id).toBe(userID);
    console.log(decoded);
  });
});
