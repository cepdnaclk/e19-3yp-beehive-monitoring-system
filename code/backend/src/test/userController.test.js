import supertest from "supertest";
import { createServer } from "../utils/server.js";
import mongoose from "mongoose";
import { mongoURL } from "../config/dbconfig.js";
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
// 1. Should Create a user
// 2. Should Try to create a user again with the same email
// 3. Should Try to login by a non existing email
// 4. Should try to login with existing email and wrong password
// 5. Should try to login with correct email and password

describe("User API", () => {
  // it("should create a user", async () => {
  //   const user = {
  //     username: "Test User",
  //     email: "testemail@example.com",
  //     password: "testpassword",
  //   };
  //   const res = await supertest(app).post("/api/user/register").send(user);
  //   //console.log(res.body);
  //   userID = res.body._id;
  //   expect(res.statusCode).toEqual(201);
  //   expect(res.body).toHaveProperty("_id");
  //   expect(res.body.username).toBe(user.username);
  //   expect(res.body.email).toBe(user.email);
  // });
  // it("should try to create a user again with the same email", async () => {
  //   const user = {
  //     username: "Test User 2",
  //     email: "testemail@example.com",
  //     password: "testnewpassword",
  //   };
  //   const res = await supertest(app).post("/api/user/register").send(user);
  //   //console.log(res.body);
  //   expect(res.statusCode).toEqual(400);
  //   expect(res.body).toHaveProperty("message");
  //   expect(res.body.message).toBe("User already exists");
  // });
  // it("should try to login by a non existing email", async () => {
  //   const user = {
  //     email: "testemail2@example.com",
  //     password: "testpassword",
  //   };
  //   const res = await supertest(app).post("/api/user/login").send(user);
  //   //console.log(res.body);
  //   expect(res.statusCode).toEqual(400);
  //   expect(res.body).toHaveProperty("message");
  //   expect(res.body.message).toBe("User does not exist");
  // });
  // it("should try to login with existing email and wrong password", async () => {
  //   const user = {
  //     email: "testemail@example.com",
  //     password: "testnewpassword",
  //   };
  //   const res = await supertest(app).post("/api/user/login").send(user);
  //   //console.log(res.body);
  //   expect(res.statusCode).toEqual(400);
  //   expect(res.body).toHaveProperty("message");
  //   expect(res.body.message).toBe("Password is incorrect");
  // });
  // it("should try to login with correct email and password", async () => {
  //   const user = {
  //     email: "testemail@example.com",
  //     password: "testpassword",
  //   };
  //   const res = await supertest(app).post("/api/user/login").send(user);
  //   console.log(res.body);
  //   expect(res.statusCode).toEqual(200);
  //   expect(res.body).toHaveProperty("accessToken");
  //   //check if the token is valid
  //   const token = res.body.accessToken;
  //   const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  //   //check that the token expires in 15 mins
  //   expect(decoded.exp - decoded.iat).toBe(900);
  //   //check that the token contains the user
  //   expect(decoded.user).toHaveProperty("username");
  //   expect(decoded.user).toHaveProperty("email");
  //   expect(decoded.user).toHaveProperty("id");
  //   expect(decoded.user.username).toBe("Test User");
  //   expect(decoded.user.email).toBe("testemail@example.com");
  //   expect(decoded.user.id).toBe(userID);
  //   console.log(decoded);


  // });


});
