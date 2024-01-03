import express from "express";
import {
  registerUser,
  loginUser,
  currentUser
} from "../controllers/userController.js";
import { validateToken } from "../middleware/validateTokenHandler.js";

export const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/current", validateToken, currentUser);
