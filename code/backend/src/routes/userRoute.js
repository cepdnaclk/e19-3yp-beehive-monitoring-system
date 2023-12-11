import express from "express";
import {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

export const router = express.Router();

router.get("/user", getAllUsers);
router.get("/user/:id", getUser);

router.post("/user", createUser);

router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);
