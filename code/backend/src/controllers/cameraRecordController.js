//Camera Record CRUD
import {CameraRecord} from '../models/cameraRecordModel.js';
import { Beehive } from '../models/beehiveModel.js';
import asyncHandler from 'express-async-handler';

import { S3Client,PutObjectCommand,GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';

dotenv.config();


const bucketName= process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY

const s3Client = new S3Client({
    region: bucketRegion,
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey
    }
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

    try {
        const urlPromises = cameraRecords.map(async (record) => {
            const getObjectParams = {
                Bucket: bucketName, // Replace with your bucket name
                Key: record.sample_image_name,
            };
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

            // Convert Mongoose document to a plain object and add the URL
            const recordObj = record.toObject();
            recordObj.sample_image_url = url;
            return recordObj;
        });

        const cameraRecordsWithUrls = await Promise.all(urlPromises);

        res.status(200).json({ cameraRecords: cameraRecordsWithUrls });
    } catch (error) {
        console.error("Error fetching URLs:", error);
        res.status(500).send("Internal Server Error");
    }
});



//@desc create new camera record
//@route POST /api/camera
//@access private

export const createCameraRecord = asyncHandler(async (req, res) => {
    console.log(req.body);
    console.log(req.file);

    const params = {
        Bucket: bucketName,
        Key: req.file.originalname,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
    };

    try {
        const data = await s3Client.send(new PutObjectCommand(params));
        console.log("Success", data);
    } catch (err) {
        console.log("Error", err);
    }


    const sample_image_name = req.file.originalname;

    const { beehive_id, folder_name, folder_size} = req.body;
    

    const isRetrieved = false;
    if (!beehive_id || !folder_name || !folder_size ) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    const cameraRecord = await CameraRecord.create({
        beehive_id,
        folder_name,
        folder_size,
        sample_image_name,
        isRetrieved,
    });
    res.status(201).json(cameraRecord);
});

//@desc get camera records by beehive_id
//@route GET /api/camera/beehive/:id
//@access private

export const getCameraRecord = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    let cameraRecords = await CameraRecord.find({ beehive_id: id });
    if (!cameraRecords) {
        res.status(404).send("Camera Record not found");
        return;
    }

    try {
        const urlPromises = cameraRecords.map(async (record) => {
            const getObjectParams = {
                Bucket: bucketName,
                Key: record.sample_image_name,
            };
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

            // Convert Mongoose document to a plain object
            const recordObj = record.toObject();
            recordObj.sample_image_url = url;
            return recordObj;
        });

        const cameraRecordsWithUrls = await Promise.all(urlPromises);

        console.log("The camera records are :", cameraRecordsWithUrls);
        res.status(200).json({ cameraRecords: cameraRecordsWithUrls });
    } catch (error) {
        console.error("Error fetching URLs:", error);
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