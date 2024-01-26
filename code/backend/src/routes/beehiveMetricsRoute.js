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
 * /api/beehive-metrics:
 *   get:
 *     summary: Get all beehive metrics
 *     description: This endpoint is for retrieving information about all beehive metrics.
 *     tags: [BeehiveMetrics]
 *     responses:
 *       200:
 *         description: Successfully retrieved beehive metrics.
 *         content:
 *           application/json:
 *             example:
 *               beehiveMetrics: [{metric1}, {metric2}, ...]
 */

/**
 * @swagger
 * /api/beehive-metrics/{beehive_id}:
 *   get:
 *     summary: Get beehive metrics by Beehive ID
 *     description: This endpoint is for retrieving information about a specific beehive metrics by ID.
 *     tags: [BeehiveMetrics]
 *     parameters:
 *       - in: path
 *         name: beehive_id
 *         required: true
 *         description: ID of the beehive.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved beehive metrics by ID.
 *         content:
 *           application/json:
 *             example:
 *               transformedData: [{createdAt, temperature, humidity, CO2}, ...]
 *       404:
 *         description: Not Found - Beehive metrics not found.
 */

/**
 * @swagger
 * /api/beehive-metrics:
 *   post:
 *     summary: Add new beehive metrics
 *     description: This endpoint is for adding new beehive metrics.
 *     tags: [BeehiveMetrics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - beehive_id
 *               - CO2
 *               - Temperature
 *               - Humidity
 *               - Weight
 *               - Battery_level
 *             properties:
 *               beehive_id:
 *                 type: string
 *                 description: ID of the beehive.
 *               CO2:
 *                 type: number
 *                 description: CO2 level.
 *               Temperature:
 *                 type: number
 *                 description: Temperature.
 *               Humidity:
 *                 type: number
 *                 description: Humidity.
 *               Weight:
 *                 type: number
 *                 description: Weight.
 *               Battery_level:
 *                 type: number
 *                 description: Battery level.
 *     responses:
 *       201:
 *         description: Successfully added new beehive metrics.
 *         content:
 *           application/json:
 *             example:
 *               beehiveMetrics: {metric}
 *       400:
 *         description: Bad Request - Invalid input or missing required fields.
 */

/**
 * @swagger
 * /api/beehive-metrics/{id}:
 *   put:
 *     summary: Update beehive metrics
 *     description: This endpoint is for updating existing beehive metrics by ID.
 *     tags: [BeehiveMetrics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the beehive metrics.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               CO2:
 *                 type: number
 *                 description: CO2 level.
 *               Temperature:
 *                 type: number
 *                 description: Temperature.
 *               Humidity:
 *                 type: number
 *                 description: Humidity.
 *               Weight:
 *                 type: number
 *                 description: Weight.
 *               Battery_level:
 *                 type: number
 *                 description: Battery level.
 *     responses:
 *       200:
 *         description: Successfully updated beehive metrics.
 *         content:
 *           application/json:
 *             example:
 *               updatedMetrics: {updatedMetric}
 *       404:
 *         description: Not Found - Beehive metrics not found.
 */

/**
 * @swagger
 * /api/beehive-metrics/{id}:
 *   delete:
 *     summary: Delete beehive metrics
 *     description: This endpoint is for deleting existing beehive metrics by ID.
 *     tags: [BeehiveMetrics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the beehive metrics.
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Successfully deleted beehive metrics.
 *         content:
 *           application/json:
 *             example:
 *               beehiveMetrics: {deletedMetric}
 *       404:
 *         description: Not Found - Beehive metrics not found.
 */

/**
 * @swagger
 * /api/beehive-metrics/export/{beehive_id}:
 *   get:
 *     summary: Export beehive metrics as CSV
 *     description: This endpoint is for exporting beehive metrics as a CSV file by Beehive ID.
 *     tags: [BeehiveMetrics]
 *     parameters:
 *       - in: path
 *         name: beehive_id
 *         required: true
 *         description: ID of the beehive.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully exported beehive metrics as CSV.
 *         content:
 *           text/csv:
 *             example:
 *               CSV file content...
 *       404:
 *         description: Not Found - Beehive metrics not found.
 */

router.use(validateToken);
router.route("/").get(getAllBeehiveMetrics).post(addBeehiveMetrics);
router.get("/export/:beehive_id", exportBeehiveMetricsCsv);

router
  .route("/:beehive_id")
  .get(getBeehiveMetricsById)
  .put(updateBeehiveMetrics)
  .delete(deleteBeehiveMetrics);
