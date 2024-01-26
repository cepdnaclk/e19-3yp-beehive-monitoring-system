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



router.use(validateToken);
router.route("/").get(getBeehives).post(createBeehive);

router.route("/:id").get(getBeehive).put(updateBeehive).delete(deleteBeehive);
