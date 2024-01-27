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
import swaggerJsDoc from "swagger-jsdoc";

/**
 * @swagger
 * /api/beehive/get:
 *   get:
 *     summary: Get beehive information
 *     description: This endpoint is for retrieving information about all beehives.
 *     tags: [Beehives]
 *     responses:
 *       200:
 *         description: Successfully retrieved beehives information.
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
 *               example2:
 *                 value:
 *                   Name: Beehive2
 *                   Location: Location2
 *                   CO2: 80
 *                   Temperature: 25
 *                   Humidity: 40
 *                   Weight: 45
 *                   Battery_level: 60
 */

/**
 * @swagger
 * /api/beehive:
 *   get:
 *     summary: Get all beehives
 *     description: Retrieve information about all beehives.
 *     tags: [Beehives]
 *     responses:
 *       200:
 *         description: Successfully retrieved all beehives.
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
 *               example2:
 *                 value:
 *                   Name: Beehive2
 *                   Location: Location2
 *                   CO2: 80
 *                   Temperature: 25
 *                   Humidity: 40
 *                   Weight: 45
 *                   Battery_level: 60
 *       401:
 *         description: Unauthorized - Token is missing or invalid.

 *   post:
 *     summary: Create a new beehive
 *     description: Create a new beehive with the provided information.
 *     tags: [Beehives]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *               - CO2
 *               - Temperature
 *               - Humidity
 *               - Weight
 *               - Battery_level
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the beehive.
 *               location:
 *                 type: string
 *                 description: Location of the beehive.
 *               CO2:
 *                 type: number
 *                 description: CO2 level.
 *               Temperature:
 *                 type: number
 *                 description: Temperature.
 *               Humidity:
 *                 type: number
 *                 description: Humidity level.
 *               Weight:
 *                 type: number
 *                 description: Weight.
 *               Battery_level:
 *                 type: number
 *                 description: Battery level.
 *     responses:
 *       201:
 *         description: Successfully created a new beehive.
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
 * /api/beehive/{id}:
 *   get:
 *     summary: Get beehive information by ID
 *     description: Retrieve information about a specific beehive by ID.
 *     tags: [Beehives]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the beehive.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved beehive information.
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
 *         description: Not Found - Beehive not found.

 *   put:
 *     summary: Update beehive information by ID
 *     description: Update information about a specific beehive by ID.
 *     tags: [Beehives]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the beehive.
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
 *                 description: Humidity level.
 *               Weight:
 *                 type: number
 *                 description: Weight.
 *               Battery_level:
 *                 type: number
 *                 description: Battery level.
 *     responses:
 *       200:
 *         description: Successfully updated beehive information.
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
 *         description: Not Found - Beehive not found.

 *   delete:
 *     summary: Delete a beehive by ID
 *     description: Delete a specific beehive by ID.
 *     tags: [Beehives]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the beehive.
 *         schema:
 *           type: string
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
 *         description: Not Found - Beehive not found.
 */

router.use(validateToken);
router.route("/").get(getBeehives).post(createBeehive);

router.route("/:id").get(getBeehive).put(updateBeehive).delete(deleteBeehive);
