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


router.post("/register", registerUser);

router.post("/login", loginUser);


router.get("/current", validateToken, currentUser);
