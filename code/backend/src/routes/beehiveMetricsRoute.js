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
 * /api/beehive-metrics/{beehive_id}:
 *   get:
 *     summary: Get Beehive Information
 *     description: This endpoint is for retrieving information about a specific beehive.
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
 *     summary: Create New BeehiveMetrics
 *     description: This endpoint is for creating a new BeehiveMetrics.
 *     tags: [BeehiveMetrics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - beehiveName
 *               - location
 *             properties:
 *               beehiveName:
 *                 type: string
 *                 description: Name of the beehive.
 *               location:
 *                 type: string
 *                 description: Location of the beehive.
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

/**
 * @swagger
 * /api/beehive-metrics/{beehive_id}:
 *   put:
 *     summary: Update BeehiveMetrics
 *     description: This endpoint is for updating an existing BeehiveMetrics.
 *     tags: [BeehiveMetrics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - beehive_id
 *             properties:
 *               beehive_id:
 *                 type: string
 *                 description: ID of the beehive.
 *     responses:
 *       200:
 *         description: Successfully updated the beehive.
 *         content:
 *           application/json:
 *             example:
 *               Name: Beehive1
 *               Location: Location1
 *               CO2: 100
 *               Temperature: 20
 *               Humidity: 30
 *               Weight: 40
 *               Battery_level: 50
 *       404:
 *         description: Not Found - Beehive Metrics not found.
 */

/**
 * @swagger
 * /api/beehive-metrics/{beehive_id}:
 *   delete:
 *     summary: Delete BeehiveMetrics
 *     description: This endpoint is for deleting an existing BeehiveMetrics.
 *     tags: [BeehiveMetrics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - beehive_id
 *             properties:
 *               beehive_id:
 *                 type: string
 *                 description: ID of the beehive.
 *     responses:
 *       200:
 *         description: Successfully deleted the beehive.
 *         content:
 *           application/json:
 *             example:
 *               Name: Beehive1
 *               Location: Location1
 *               CO2: 100
 *               Temperature: 20
 *               Humidity: 30
 *               Weight: 40
 *               Battery_level: 50
 *       404:
 *         description: Not Found - Beehive Metrics not found.
 */

router.use(validateToken);
router.route("/").get(getAllBeehiveMetrics).post(addBeehiveMetrics);
router.get("/export/:beehive_id", exportBeehiveMetricsCsv);

router
  .route("/:beehive_id")
  .get(getBeehiveMetricsById)
  .put(updateBeehiveMetrics)
  .delete(deleteBeehiveMetrics);
