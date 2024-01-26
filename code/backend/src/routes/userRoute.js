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
 *       200:
 *         description: User successfully registered.
 *       400:
 *         description: Bad Request - Invalid input or missing required fields.
 *       401:
 *         description: Unauthorized - Authentication failed or user already exists.
 */

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: User login
 *     description: This endpoint is for logging user into their account.
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
 *       400:
 *         description: Bad Request - Invalid input or missing required fields.
 *       401:
 *         description: Unauthorized - Authentication failed - email or password is not valid.
 *       404:
 *         description: Not Found - User not found.
 */

/**
 * @swagger
 * /api/user/current:
 *   get:
 *     summary: Get current user information
 *     description: This endpoint is for retrieve information about the current user.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Successful response with the current user's information.
 *         content:
 *           application/json:
 *             example:
 *               username: "exampleUser"
 *               email: "user@example.com"
 *
 *       400:
 *         description: Bad Request - Invalid input or missing required fields.
 *       401:
 *         description: Unauthorized. User not authenticated.
 */

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/current", validateToken, currentUser);
