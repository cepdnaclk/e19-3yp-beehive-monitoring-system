import express from "express";
import { validateToken } from "../middleware/validateTokenHandler.js";
import {
  getAllBeehiveMetrics,
  getBeehiveMetricsById,
  addBeehiveMetrics,
  updateBeehiveMetrics,
  deleteBeehiveMetrics,
  exportBeehiveMetricsCsv,
} from "../controllers/beehiveMetricsController.js";

export const router = express.Router();

router.use(validateToken);
router.route("/").get(getAllBeehiveMetrics).post(addBeehiveMetrics);
router.get('/export/:beehive_id', exportBeehiveMetricsCsv);

router
  .route("/:beehive_id")
  .get(getBeehiveMetricsById)
  .put(updateBeehiveMetrics)
  .delete(deleteBeehiveMetrics);


