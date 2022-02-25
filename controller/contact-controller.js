const MyError = require("../utils/myerror");
const asyncHandler = require("express-async-handler");
const responseHandler = require("../utils/responseHandler");
const paginate = require("../utils/paginate-sequelize");
const Sequelize = require("sequelize");
const Constants = require("../constants/constants");
const Op = Sequelize.Op;

exports.getContacts = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || Constants.DEFAULT_PAGE;
  const limit = parseInt(req.query.limit) || Constants.DEFAULT_LIMIT;
  const sort = req.query.sort;
  let select = req.query.select;

  if (select) {
    select = select.split(" ");
  }

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, req.db.contact);

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

  const contacts = await req.db.contact.findAll({
    ...query,
    include: [
      {
        model: req.db.customer,
        as: "company",
        attributes: ["id", "company_name"],
      },
    ],
  });

  responseHandler(res, {
    total: pagination.total,
    list: contacts,
    pagination,
  });
});

exports.getContact = asyncHandler(async (req, res, next) => {
  const contact = await req.db.contact.findOne({
    where: {
      id: {
        [Op.eq]: req.params.id,
      },
    },
  });

  if (!contact) {
    throw new MyError(req.params.id + " contact info not found.", 404);
  }

  responseHandler(res, {
    data: contact,
  });
});

exports.createContact = asyncHandler(async (req, res, next) => {
  const customer = await req.db.customer.findByPk(req.body.id);

  if (!customer) {
    throw new MyError(req.body.id + " customer not found.", 400);
  }

  req.body.companyId = req.userId;
  req.body.customerId = req.userId;

  delete req.body.id;

  const contacts = await req.db.contact.create(req.body);

  responseHandler(res, {
    contacts,
  });
});

exports.updateContact = asyncHandler(async (req, res, next) => {
  const contact = await req.db.contact.findByPk(req.body.id);

  if (!contact) {
    throw new MyError(req.body.id + " contact info not found.", 400);
  }

  req.body.updatedAt = new Date();

  for (let attr in req.body) {
    contact[attr] = req.body[attr];
  }

  await contact.save();

  responseHandler(res, {
    data: contact,
  });
});

exports.deleteContact = asyncHandler(async (req, res, next) => {
  const contact = await req.db.contact.findByPk(req.body.id);

  if (!contact) {
    throw new MyError(req.body.id + " contact info not found", 404);
  }

  contact.destroy();

  responseHandler(res, {
    data: contact,
  });
});
