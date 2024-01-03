//Camera Record CRUD
import {CameraRecord} from '../models/cameraRecordModel.js';
import asyncHandler from 'express-async-handler';

//@desc Get all camera records
//@route GET /api/cameraRecords
//@access private

export const getCameraRecords = asyncHandler(async (req, res) => {
    const cameraRecords = await CameraRecord.find({});
    res.status(200).json({ cameraRecords });
    });


//@desc create new camera record
//@route POST /api/cameraRecords
//@access private

export const createCameraRecord = asyncHandler(async (req, res) => {
    console.log("The request body is :", req.body);
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