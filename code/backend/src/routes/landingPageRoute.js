import express from "express";
import path from "path";
import { fileURLToPath } from 'url';

//const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const router = express.Router();

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../index.html")); // Adjust the relative path as necessary
});


