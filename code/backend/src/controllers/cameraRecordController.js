//Camera Record CRUD
import {CameraRecord} from '../models/cameraRecordModel.js';
import { Beehive } from '../models/beehiveModel.js';
import asyncHandler from 'express-async-handler';

import { S3Client } from '@aws-sdk/client-s3';
import dotenv from dotenv;

dotenv.config();

//@desc Get all camera records
//@route GET /api/camera
//@access private

export const getCameraRecords = asyncHandler(async (req, res) => {
    //get camera records belong to user
    //but only beehive_id is with camera records
    //so we need to get all beehives belong to user
    //then we can get all camera records belong to user
    const { id } = req.user;
    console.log("The request user is :", req.user);

    //get all beehives belong to user
    const beehives = await Beehive.find({ user_id: id });
    //get all camera records belong to user

    console.log("The beehives are :", beehives);

    const beehive_ids = beehives.map((beehive) => beehive._id);
    const cameraRecords = await CameraRecord.find({
        beehive_id: { $in: beehive_ids },
    });

    res.status(200).json({ cameraRecords });
    });


//@desc create new camera record
//@route POST /api/camera
//@access private

export const createCameraRecord = asyncHandler(async (req, res) => {
    console.log(req.body);
    console.log(req.file);
    const { beehive_id, folder_name, folder_size, sample_image } = req.body;
    

    const isRetrieved = false;
    if (!beehive_id || !folder_name || !folder_size || !sample_image ) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    const cameraRecord = await CameraRecord.create({
        beehive_id,
        folder_name,
        folder_size,
        sample_image,
        isRetrieved,
    });
    res.status(201).json(cameraRecord);
});

//@desc get camera records by beehive_id
//@route GET /api/camera/beehive/:id
//@access private

export const getCameraRecord = asyncHandler(async (req, res) => {
    const { id } = req.params;
    //find by beehive Id
    const cameraRecords = await CameraRecord.find({ beehive_id: id });
    if (!cameraRecords) {
        res.status(404);
        throw new Error("Camera Record not found");
    }
    res.status(200).json({cameraRecords});
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