const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const requestIp = require("request-ip");
const MyError = require("../utils/myerror");

exports.protect = asyncHandler(async (req, res, next) => {
    if (!req.headers.authorization) {
        throw new MyError(
            "Уучлаарай та хандах эрхгүй байна. Та эхлээд логин хийнэ үү.",
            401
        );
    }

    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
        throw new MyError("Токен байхгүй байна. Та эхлээд логин хийнэ үү.", 401);
    }
    // let tokenObj;
    // try {
    const tokenObj = jwt.verify(token, process.env.JWT_SECRET);
    // } catch (e) {

    // }

    if (tokenObj.active !== "active") {
        throw new MyError(
            "Уучлаарай таны эрх хязгаарлагдсан байна. Админтай холбоо барина уу.",
            400
        );
    }

    req.userId = tokenObj.id;
    req.is_admin = tokenObj.is_admin;
    req.active = tokenObj.active;

    next();
});

exports.likeMiddleware = asyncHandler(async (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            throw new MyError("Токен байхгүй байна. Та эхлээд логин хийнэ үү.", 401);
        }
        const tokenObj = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = tokenObj.id;
    } else {
        req.userId = null;
    }

    next();
});

exports.authorize = () => {
    return (req, res, next) => {
        if (req.is_admin === "false") {
            throw new MyError("Таны эрх энэ үйлдлийг гүйцэтгэхэд хүрэлцэхгүй!", 403);
        }
        next();
    };
};

// inside middleware handler
exports.ipMiddleware = asyncHandler(async (req, res, next) => {
    const clientIp = requestIp.getClientIp(req);
    req.clientIp = clientIp;

    next();
});
