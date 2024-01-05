import express from "express";
import { validateToken } from "../middleware/validateTokenHandler.js";
import {
  getBeehives,
  createBeehive,
  getBeehive,
  updateBeehive,
  deleteBeehive,
} from "../controllers/beehiveController.js";

export const router = express.Router();

router.use(validateToken);
router.route("/").get(getBeehives).post(createBeehive);

router.route("/:id").get(getBeehive).put(updateBeehive).delete(deleteBeehive);
