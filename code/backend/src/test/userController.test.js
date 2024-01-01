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
// 1. Should Create a user
// 2. Should Try to create a user again with the same email
// 3. Should Try to login by a non existing email
// 4. Should try to login with existing email and wrong password
// 5. Should try to login with correct email and password

describe("User API", () => {
  it("should create a user", async () => {
    const user = {
      username: "Test User",
      email: "testemail@example.com",
      password: "testpassword",
    };
    const res = await supertest(app).post("/api/user/register").send(user);
    console.log(res.body);
    userID = res.body._id;
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.username).toBe(user.username);
    expect(res.body.email).toBe(user.email);
  });
  it("should try to create a user again with the same email",async () =>{
    const user = {
      username : "Test User 2",
      email : "testemail@example.com",
      password: "testnewpassword"
    
    }
    const res = await supertest(app).post("/api/user/register").send(user);
    console.log(res.body)
  })
  
});
