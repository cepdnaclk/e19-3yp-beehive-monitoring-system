import express from "express";
import { validateToken } from "../middleware/validateTokenHandler.js";
import {
  getAllBeehiveMetrics,
  getBeehiveMetricsById,
  addBeehiveMetrics,
  updateBeehiveMetrics,
  deleteBeehiveMetrics,
} from "../controllers/beehiveMetricsController.js";

export const router = express.Router();

router.use(validateToken);
router.route("/").get(getAllBeehiveMetrics).post(addBeehiveMetrics);

router
  .route("/:beehive_id")
  .get(getBeehiveMetricsById)
  .put(updateBeehiveMetrics)
  .delete(deleteBeehiveMetrics);


