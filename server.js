const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const requestIp = require("request-ip");
// third party packages
const morgan = require("morgan");
const rfs = require("rotating-file-stream");
const fileupload = require("express-fileupload");

// Custom
const errorHandler = require("./middleware/error");

// Midllewares
const logger = require("./middleware/logger");
const injectDb = require("./middleware/injectDb");

// Router
const customerRoutes = require("./routes/customer");
const contactRoutes = require("./routes/contact");
const userRoutes = require("./routes/user");
const weatherRoutes = require("./routes/weather");

dotenv.config({
  path: "./config.env",
});

// Sequelize with any database тэй ажиллах обьект
const db = require("./config/db");

const app = express();

var accessLogStream = rfs.createStream("access.log", {
  interval: "1d",
  path: path.join(__dirname, "log"),
});

const whitelist = ["http://localhost:3000", "http://localhost:4000"];
const corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

app.use(cors(corsOptionsDelegate));
app.use(fileupload());
app.use(express.json());
app.use(requestIp.mw());
app.use(logger);
app.use(injectDb(db));
app.use(morgan("combined", { stream: accessLogStream }));
app.use("/api/v1/customers", customerRoutes);
app.use("/api/v1/contacts", contactRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/weather", weatherRoutes);
app.use(errorHandler);

// Customer, Contact [n:m]
db.customer.hasMany(db.contact, { as: "contacts" });
db.contact.belongsTo(db.customer, { as: "company" });

// Моделиудаас базыг үүсгэнэ (хэрэв үүсээгүй бол)
db.sequelize
  .sync() // {force: true}
  .then(() => {
    console.log("!!!sync success!!!");
  })
  .catch((err) => console.log(err));

const server = app.listen(
  process.env.PORT,
  console.log(`express server...${process.env.PORT} running.`)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
