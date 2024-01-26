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
import swaggerJsDoc from "swagger-jsdoc";

/**
 * @swagger
 * /api/beehive-metrics/:beehive_id:
 *   get:
 *     summary: Get beehive information
 *     description: This endpoint is for retrieving information about a beehive.
 *     tags: [BeehiveMetrics]
 *     responses:
 *       200:
 *         description: Successfully retrieved beehive information.
 *         content:
 *           application/json:
 *             examples:
 *               example1:
 *                 value:
 *                   Name: Beehive1
 *                   Location: Location1
 *                   CO2: 100
 *                   Temperature: 20
 *                   Humidity: 30
 *                   Weight: 40
 *                   Battery_level: 50
 */

/**
 * @swagger
 * /api/beehive-metrics:
 *   post:
 *     summary: Get new BeehiveMetrics
 *     description: This endpoint is for creating a new BeehiveMetrics.
 *     tags: [BeehiveMetrics]
 *     responses:
 *       201:
 *         description: Successfully created a beehive.
 *         content:
 *           application/json:
 *             examples:
 *               example1:
 *                 value:
 *                   Name: Beehive1
 *                   Location: Location1
 *                   CO2: 100
 *                   Temperature: 20
 *                   Humidity: 30
 *                   Weight: 40
 *                   Battery_level: 50
 *       400:
 *         description: Bad Request - Invalid input or missing required fields.
 */

router.use(validateToken);
router.route("/").get(getAllBeehiveMetrics).post(addBeehiveMetrics);
router.get("/export/:beehive_id", exportBeehiveMetricsCsv);

router
  .route("/:beehive_id")
  .get(getBeehiveMetricsById)
  .put(updateBeehiveMetrics)
  .delete(deleteBeehiveMetrics);
