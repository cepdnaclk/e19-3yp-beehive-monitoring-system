import express from "express";
import {
  registerUser,
  loginUser,
  currentUser,
} from "../controllers/userController.js";
import { validateToken } from "../middleware/validateTokenHandler.js";

export const router = express.Router();
import swaggerJsDoc from "swagger-jsdoc";

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register new user
 *     description: This endpoint is for registering a new user.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username of the user.
 *               password:
 *                 type: string
 *                 description: Password of the user.
 *               email:
 *                 type: string
 *                 description: Email of the user.
 *     responses:
 *       201:
 *         description: User successfully registered.
 *         content:
 *           application/json:
 *             example:
 *               _id: "user_id"
 *               email: "user@example.com"
 *               username: "exampleUser"
 *       400:
 *         description: Bad Request - Invalid input or missing required fields.
 *         content:
 *           application/json:
 *             example:
 *               message: "All fields are mandatory!"
 *       401:
 *         description: Unauthorized - Authentication failed or user already exists.
 *         content:
 *           application/json:
 *             example:
 *               message: "User already registered!"
 */

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: User login
 *     description: This endpoint is for logging the user into their account.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - email
 *             properties:
 *               password:
 *                 type: string
 *                 description: Password of the user.
 *               email:
 *                 type: string
 *                 description: Email of the user.
 *     responses:
 *       200:
 *         description: User successfully logged in.
 *         content:
 *           application/json:
 *             example:
 *               accessToken: "your_access_token_here"
 *       400:
 *         description: Bad Request - Invalid input or missing required fields.
 *         content:
 *           application/json:
 *             example:
 *               message: "All fields are mandatory!"
 *       401:
 *         description: Unauthorized - Authentication failed - email or password is not valid.
 *         content:
 *           application/json:
 *             example:
 *               message: "Incorrect password"
 *       404:
 *         description: Not Found - User not found.
 *         content:
 *           application/json:
 *             example:
 *               message: "User not found"
 */

/**
 * @swagger
 * /api/user/current:
 *   get:
 *     summary: Get current user information
 *     description: This endpoint is for retrieving information about the current user.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successful response with the current user's information.
 *         content:
 *           application/json:
 *             example:
 *               username: "exampleUser"
 *               email: "user@example.com"
 *       400:
 *         description: Bad Request - Invalid input or missing required fields.
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid request"
 *       401:
 *         description: Unauthorized. User not authenticated.
 *         content:
 *           application/json:
 *             example:
 *               message: "Unauthorized"
 */

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/current", validateToken, currentUser);
