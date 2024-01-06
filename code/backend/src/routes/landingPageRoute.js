import express from "express";
import path from "path";
import { fileURLToPath } from 'url';

//Uncomment this line when testing locally

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const router = express.Router();

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../index.html")); // Adjust the relative path as necessary
});


