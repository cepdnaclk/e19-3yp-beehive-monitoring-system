//Camera Record CRUD
import { CameraRecord } from "../models/cameraRecordModel.js";
import { Beehive } from "../models/beehiveModel.js";
import asyncHandler from "express-async-handler";

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";

dotenv.config();

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3Client = new S3Client({
  region: bucketRegion,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
});

//@desc Get all camera records
//@route GET /api/camera
//@access private

export const getCameraRecords = asyncHandler(async (req, res) => {
  const { id } = req.user;
  console.log("The request user is :", req.user);

  // Get all beehives belong to user
  const beehives = await Beehive.find({ user_id: id });
  console.log("The beehives are :", beehives);

  const beehive_ids = beehives.map((beehive) => beehive._id);

  // Get all camera records belong to those beehives
  let cameraRecords = await CameraRecord.find({
    beehive_id: { $in: beehive_ids },
  });

  console.log("The camera records are :", cameraRecords);

  try {
    const staticImageUrl = "https://ogden_images.s3.amazonaws.com/www.iamcountryside.com/images/sites/4/2022/05/13124510/beehive-entrance.jpg"; // Replace with your static image URL

    const cameraRecordsWithUrls = cameraRecords.map((record) => {
      // Convert Mongoose document to a plain object
      const recordObj = record.toObject();

      // Add the static URL for all sample_image_urls
      recordObj.sample_image_urls = record.sample_image_names.map(() => staticImageUrl);

      return recordObj;
    });

    res.status(200).json({ cameraRecords: cameraRecordsWithUrls });
  } catch (error) {
    console.error("Error processing records:", error);
    res.status(500).send("Internal Server Error");
  }
});


//@desc create new camera record
//@route POST /api/camera
//@access private

export const createCameraRecord = asyncHandler(async (req, res) => {
  console.log(req.body);
  console.log(req.files);

  const { beehive_id, folder_name, folder_size } = req.body;
  if (!beehive_id || !folder_name || !folder_size) {
    res.status(400).throw(new Error("All fields are mandatory"));
  }

  const recordDateTime = new Date().toISOString(); // Use ISO string or format as you like

  // Process each file and upload to S3
  const uploadedFiles = [];
  for (const fieldName in req.files) {
    const fileArray = req.files[fieldName];
    for (const file of fileArray) {
      const s3Key = `HiveImages/${beehive_id}/${recordDateTime}/${file.originalname}`;
      const params = {
        Bucket: bucketName,
        Key: s3Key,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      try {
        const data = await s3Client.send(new PutObjectCommand(params));
        console.log("Success", data);
        uploadedFiles.push(s3Key); // Store the full S3 key
      } catch (err) {
        console.log("Error", err);
      }
    }
  }

  console.log("The uploaded files are :", uploadedFiles);
  const cameraRecord = await CameraRecord.create({
    beehive_id,
    folder_name,
    folder_size,
    sample_image_names: uploadedFiles, // Now contains the S3 keys
    isRetrieved: false,
  });
  res.status(201).json(cameraRecord);
});

//@desc get camera records by beehive_id
//@route GET /api/camera/beehive/:id
//@access private

export const getCameraRecord = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Fetch camera records for the given beehive_id
  const cameraRecords = await CameraRecord.find({ beehive_id: id });
  if (!cameraRecords || cameraRecords.length === 0) {
    res.status(404).send("Camera Record not found");
    return;
  }

  try {
    // Define a static image URL
    const staticImageUrl = "https://ogden_images.s3.amazonaws.com/www.iamcountryside.com/images/sites/4/2022/05/13124510/beehive-entrance.jpg"; // Replace with your static image URL

    // Map camera records and add URLs and formatted timestamps
    const cameraRecordsWithUrls = cameraRecords.map((record) => {
      console.log(record);

      // Convert Mongoose document to a plain object
      const recordObj = record.toObject();

      // Add static URLs for sample_image_urls
      recordObj.sample_image_urls = record.sample_image_names.map(() => staticImageUrl);

      // Convert createdAt to GMT+5:30 and add as a new field
      recordObj.createdAtLocal = new Date(record.createdAt).toLocaleString("en-US", {
        timeZone: "Asia/Colombo",
      });

      return recordObj;
    });

    console.log("The camera records are:", cameraRecordsWithUrls);

    res.status(200).json({ cameraRecords: cameraRecordsWithUrls });
  } catch (error) {
    console.error("Error processing records:", error);
    res.status(500).send("Internal Server Error");
  }
});


//@desc delete camera record by id
//@route DELETE /api/camera/:id
//@access private

export const deleteCameraRecord = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const cameraRecord = await CameraRecord.findById(id);
  if (!cameraRecord) {
    res.status(404);
    throw new Error("Camera Record not found");
  }
  await cameraRecord.deleteOne();
  res.status(200).json({ message: "Camera Record removed" });
});

//@desc update camera record by id
//@route PUT /api/camera/:id
//@access private

export const updateCameraRecord = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const cameraRecord = await CameraRecord.findById(id);
  if (!cameraRecord) {
    res.status(404);
    throw new Error("Camera Record not found");
  }
  const updatedCameraRecord = await CameraRecord.findByIdAndUpdate(
    id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedCameraRecord);
});
