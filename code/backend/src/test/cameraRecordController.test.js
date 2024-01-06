import supertest from "supertest";
import { createServer } from "../utils/server.js";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import dotenv from "dotenv/config.js";
import path from "path";
import fs from "fs";

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
var accessToken = "";
var beehiveId1 = 1;
var beehiveId2 = 2;

//Test Flow

//1. Create a user
//2. Login with the user
//3. Create 2 beehives
//4. Add camera records to the beehives
//5. Get all camera records
//6. Get camera records by beehive id
//7. Update camera records
//8. Delete camera records

describe("Test camera records", () => {
    it("Should create a user", async () => {
        const response = await supertest(app).post("/api/user/register").send({
            username: "TestUser123",
            email: "example@example.com",
            password: "Sa123456!",
        });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("username");
        expect(response.body).toHaveProperty("email");
        

        userID = response.body._id;
    }
    );

    it("Should login with the user", async () => {
        const response = await supertest(app).post("/api/user/login").send({
            email: "example@example.com",
            password: "Sa123456!",
        });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("accessToken");
        accessToken = response.body.accessToken;
    });

    

    it("Should create a beehive", async () => {
        const response = await supertest(app).post("/api/beehive").send({
            name: "Test Beehive 1",
            CO2: "Test CO2 1",
            Temperature: "Test Temperature 1",
            Humidity: "Test Humidity 1",
            Weight: "Test Weight 1",
        }).set("Authorization", `Bearer ${accessToken}`);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("name");
        expect(response.body).toHaveProperty("CO2");
        expect(response.body).toHaveProperty("Temperature");
        expect(response.body).toHaveProperty("Humidity");
        expect(response.body).toHaveProperty("Weight");
        expect(response.body).toHaveProperty("user_id");
        beehiveId1 = response.body._id;
    });

    it("Should create another beehive", async () => {
        const response = await supertest(app).post("/api/beehive").send({
            name: "Test Beehive 2",
            CO2: "Test CO2 2",
            Temperature: "Test Temperature 2",
            Humidity: "Test Humidity 2",
            Weight: "Test Weight 2",
        }).set("Authorization", `Bearer ${accessToken}`);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("name");
        expect(response.body).toHaveProperty("CO2");
        expect(response.body).toHaveProperty("Temperature");
        expect(response.body).toHaveProperty("Humidity");
        expect(response.body).toHaveProperty("Weight");
        expect(response.body).toHaveProperty("user_id");
        beehiveId2 = response.body._id;
    });

    it("Should add camera records to the beehives with image upload", async () => {
        const imagePath = path.join(__dirname, 'test.png'); 
        console.log(imagePath);
    
        const response = await supertest(app)
            .post("/api/camera")
            .set("Authorization", `Bearer ${accessToken}`)
            .field("beehive_id", beehiveId1)
            .field("folder_name", "Test Folder Name 1")
            .field("folder_size", "Test Folder Size 1")
            .attach("sample_image", imagePath) // Attaching the image
            .expect(201);
    
        expect(response.body).toHaveProperty("beehive_id");
        expect(response.body).toHaveProperty("folder_name");
        expect(response.body).toHaveProperty("folder_size");
        // Uncomment if your response includes sample_image information
        // expect(response.body).toHaveProperty("sample_image");
    });

    // it("Should add camera records to the beehives", async () => {
    //     const response = await supertest(app).post("/api/camera").send({
    //         beehive_id: beehiveId1,
    //         folder_name: "Test Folder Name 1",
    //         folder_size: "Test Folder Size 1",
    //         sample_image: "Test Sample Image 1",
    //     }).set("Authorization", `Bearer ${accessToken}`);
    //     expect(response.status).toBe(201);
    //     expect(response.body).toHaveProperty("beehive_id");
    //     expect(response.body).toHaveProperty("folder_name");
    //     expect(response.body).toHaveProperty("folder_size");
    //     //expect(response.body).toHaveProperty("sample_image");
    // });

    // it("Should add camera records to the beehives", async () => {
    //     const response = await supertest(app).post("/api/camera").send({
    //         beehive_id: beehiveId2,
    //         folder_name: "Test Folder Name 2",
    //         folder_size: "Test Folder Size 2",
    //         sample_image: "Test Sample Image 2",
    //     }).set("Authorization", `Bearer ${accessToken}`);
    //     expect(response.status).toBe(201);
    //     expect(response.body).toHaveProperty("beehive_id");
    //     expect(response.body).toHaveProperty("folder_name");
    //     expect(response.body).toHaveProperty("folder_size");
    //     //expect(response.body).toHaveProperty("sample_image");
    // });

    it("Should get all camera records", async () => {
        const response = await supertest(app).get("/api/camera").set("Authorization", `Bearer ${accessToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("cameraRecords");
        expect(response.body.cameraRecords).toHaveLength(2);
    });

});






