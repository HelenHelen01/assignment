const MyError = require("../utils/myerror");
const asyncHandler = require("express-async-handler");
const responseHandler = require("../utils/responseHandler");
const paginate = require("../utils/paginate-sequelize");
const Sequelize = require("sequelize");
const Constants = require("../constants/constants");
const Op = Sequelize.Op;
const lodash = require('lodash')

exports.getCustomers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || Constants.DEFAULT_PAGE;
  const limit = parseInt(req.query.limit) || Constants.DEFAULT_LIMIT;
  const sort = req.query.sort;
  let select = req.query.select;

  if (select) {
    select = select.split(" ");
  }

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, req.db.customer);

  let query = {};

  if (req.query) {
    query.where = req.query;
  }

  if (select) {
    query.attributes = select;
  }

  if (sort) {
    query.order = sort
      .split(" ")
      .map((el) => [
        el.charAt(0) === "-" ? el.substring(1) : el,
        el.charAt(0) === "-" ? "DESC" : "ASC",
      ]);
  }

  const customers = await req.db.customer.findAll({
    ...query,
    include: [{ model: req.db.contact, as: "contacts", attributes: ['firstname', 'lastname', 'phone_number'] }],
  });

  responseHandler(res, {
    total: pagination.total,
    list: customers,
    pagination,
  });
});

exports.getCustomer = asyncHandler(async (req, res, next) => {
  const customer = await req.db.customer.findOne({
    where: {
      id: {
        [Op.eq]: req.params.id,
      }
    }
  });

  if (!customer) {
    throw new MyError(req.params.id + " customer not found.", 404);
  }

  responseHandler(res, {
    data: customer,
  });
});

exports.createCustomer = asyncHandler(async (req, res, next) => {

  const customer = await req.db.customer.create(req.body);

  responseHandler(res, {
    customer,
  });
});

exports.updateCustomer = asyncHandler(async (req, res, next) => {

  const customer = await req.db.customer.findByPk(req.body.id);

  if (!customer) {
    throw new MyError(req.body.id + " customer not found.", 400);
  }

  req.body.updatedAt = new Date()

  for (let attr in req.body) {
    customer[attr] = req.body[attr];
  }

  await customer.save();

  responseHandler(res, {
    data: customer,
  });
});

exports.deleteCustomer = asyncHandler(async (req, res, next) => {
  const customer = await req.db.customer.findByPk(req.body.id);

  if (!customer) {
    throw new MyError(
      req.body.id + " customer not found",
      404
    );
  }

  customer.destroy();

  responseHandler(res, {
    data: customer,
  });
});
