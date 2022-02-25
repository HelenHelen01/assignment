const Sequelize = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { slugify } = require("transliteration");

let db = {};

const sequelize = new Sequelize(
  process.env.SEQUELIZE_DATABASE,
  process.env.SEQUELIZE_USERNAME,
  process.env.SEQUELIZE_PASSWORD,
  {
    host: process.env.SEQUELIZE_HOST,
    port: process.env.SEQUELIZE_PORT,
    dialect: process.env.SEQUELIZE_DIALECT,
    define: {
      freezeTableName: true,
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 60000, // milliseconds
      idle: 10000,
    },
    operatorAliases: false,
  }
);

const models = [
  require("../model/Customer"),
  require("../model/Contact"),
  require("../model/SysUser"),
];

models.forEach((model) => {
  const seqModel = model(sequelize, Sequelize);
  db[seqModel.name] = seqModel;
});

db.sequelize = sequelize;

db.sys_user.prototype.getJWT = function (obj) {
  return {
    token: tokenGenerate(obj),
    refresh: tokenGenerate(obj, false),
  };
};

const tokenGenerate = (obj, type = true) => {
  return jwt.sign(
    {
      id: obj.id,
      name: obj.name,
      is_admin: obj.is_admin ? "true" : "false",
      active: obj.active,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: type
        ? process.env.JWT_LOGIN_EXPIRESIN
        : process.env.JWT_REFRESH_EXPIRESIN,
    }
  );
};

db.sys_user.prototype.checkPassword = async function (enteredPassword, obj) {
  return await bcrypt.compare(enteredPassword, obj.password);
};

module.exports = db;
