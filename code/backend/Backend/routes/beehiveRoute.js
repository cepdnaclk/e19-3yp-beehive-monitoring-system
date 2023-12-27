const express = require("express");
const router = express.Router();
const {
  getBeehives,
  createBeehive,
  getBeehive,
  updateBeehive,
  deleteBeehive,
} = require("../controllers/beehiveController");

router.route("/").get(getBeehives).post(createBeehive);

router.route("/:id").get(getBeehive).put(updateBeehive).delete(deleteBeehive);

module.exports = router;
