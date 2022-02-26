const asyncHandler = require("../middleware/asyncHandler");
const axios = require("axios");
const responseHandler = require("../utils/responseHandler");

exports.getWeather = asyncHandler(async (req, res, next) => {
  const lat = req.query.lat || 0;
  const lng = req.query.lng || 0;

  if (lat !== 0 && lng !== 0) {
    console.log("lat and lng", lat, lng);
    const response = await axios.get(
      //`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&exclude=minutely&units=metric&appid=a0fa206a26403b10b87b72b61a7d2d6e`//
      //`https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lng}&exclude=minutely&units=metric&appid=a0fa206a26403b10b87b72b61a7d2d6e`//
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=a0fa206a26403b10b87b72b61a7d2d6e`
    );
    console.log(response.data);
    responseHandler(res, { list: response.data });
    // res.status(json(data));
  } else {
    responseHandler(res, { list: [] });
  }
});
