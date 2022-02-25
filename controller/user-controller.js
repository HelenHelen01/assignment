const MyError = require("../utils/myerror");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate-sequelize");
const Sequelize = require("sequelize");
const responseHandler = require("../utils/responseHandler");
const Op = Sequelize.Op;
const bcrypt = require('bcrypt')

// register
exports.register = asyncHandler(async (req, res, next) => {
    const sys_user = await req.db.sys_user.create(req.body);
    responseHandler(res, {
        sys_user: sys_user,
    })
});

exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new MyError("Имэйл болон нууц үгээ дамжуулна уу.", 404);
    }

    const user = await req.db.sys_user
        .findOne({
            where: {
                email: {
                    [Op.eq]: email,
                },
            },
        });

    if (!user) {
        throw new MyError("Имэйл болон нууц үгээ зөв оруулна уу.", 401);
    }

    const ok = await user.checkPassword(password, user);

    if (!ok) {
        throw new MyError("Имэйл болон нууц үгээ зөв оруулна уу.", 401);
    }

    if (user.active !== "active") {
        throw new MyError(
            "Уучлаарай таны эрх хязгаарлагдсан байна. Админтай холбоо барина уу.",
            400
        );
    }

    const credentials = user.getJWT(user);

    responseHandler(res, {
        token: credentials.token,
        refresh: credentials.refresh,
        user: {
            name: user.name,
            email: user.email,
            is_admin: user.is_admin,
        },
    });
});

exports.getUsers = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page) || Constants.DEFAULT_PAGE;
    const limit = parseInt(req.query.limit) || Constants.DEFAULT_LIMIT;
    const sort = req.query.sort;
    let select = req.query.select;

    if (select) {
        select = select.split(" ");
    }

    ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

    const pagination = await paginate(page, limit, req.db.sys_user);

    let query = { offset: pagination.start - 1, limit };

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

    const users = await req.db.sys_user.findAll(query);

    responseHandler(res, {
        data: users,
        pagination,
    })
});

exports.me = asyncHandler(async (req, res, next) => {
    const user = await req.db.sys_user.findByPk(req.userId);

    if (!user) {
        throw new MyError(req.userId + " ID-тэй хэрэглэгч байхгүй!", 400);
    }

    responseHandler(res, {
        data: {
            name: user.name,
            email: user.email,
            is_admin: user.is_admin,
            active: user.active
        }
    })
});

exports.blockUser = asyncHandler(async (req, res, next) => {
    const user = await req.db.sys_user.update(req.body, {
        where: {
            id: {
                [Op.eq]: req.params.id,
            },
        },
    });

    if (!user) {
        throw new MyError(req.params.id + " ID-тэй хэрэглэгч байхгүй.", 400);
    }

    responseHandler(res, {
        data: user,
    })
});


exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await req.db.sys_user.findByPk(req.body.id);

    if (!user) {
        throw new MyError(
            req.body.id + " ID-тэй хэрэглэгч байхгүй байна.",
            404
        );
    }

    if (!user.id === 1) {
        user.destroy();
    } else {
        throw new MyError("Админ хэрэглэгч устгах боломжгүй.",
            404
        );
    }

    responseHandler(res, {
        data: user,
    });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
    const user = await req.db.sys_user.findByPk(req.body.id);

    if (!user) {
        throw new MyError(
            req.body.id + " ID-тэй хэрэглэгч байхгүй байна.",
            404
        );
    }

    if (!req.body.password) {
        throw new MyError("Нууц үг оруулна уу.",
            404
        );
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    await user.save()

    responseHandler(res, {
        data: user,
    });
});
