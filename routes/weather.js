const express = require("express");
const { getWeather } = require("../controller/weather-controller");
const router = express.Router();

// /api/v1/weather
router.route("/").get(getWeather);

module.exports = router;
