const asyncHandler = require("../middleware/asyncHandler");
const axios = require("axios");
const responseHandler = require("../utils/responseHandler");

exports.getWeather = asyncHandler(async (req, res, next) => {
  const lat = req.query.lat || 0;
  const lng = req.query.lng || 0;
  if (lat !== 0 && lng !== 0) {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&exclude=minutely&units=metric&appid=a0fa206a26403b10b87b72b61a7d2d6e`
    );
    responseHandler(res, { list: response.data });
  } else {
    responseHandler(res, { list: [] });
  }
});
