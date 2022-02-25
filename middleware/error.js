const errorHandler = (err, req, res, next) => {
    // console.log(err.stack);

    const error = { ...err };

    error.message = err.message;

    // Алдааны мэссэжийг монгол болгох
    if (error.name === "CastError") {
        error.message = "Энэ ID буруу бүтэцтэй ID байна!";
        error.statusCode = 401;
    }

    if (error.name === "JsonWebTokenError" && error.message === "invalid token") {
        error.message = "Буруу токен дамжуулсан байна!";
        error.statusCode = 401;
    }

    // if (error.name === 'TokenExpiredError') {
    //     console.log('Token expired error')
    // }

    if (error.message === "jwt expired") {
        error.message = "Нэвтрэх эрхийн хугацаа дууссан байна!";
        error.statusCode = 401;
    }

    if (error.code === 11000) {
        error.message = "Талбарын утгыг давхардуулж өгч болохгүй.";
        error.statusCode = 400;
    }

    res.status(error.statusCode || 500).json({
        status_code: error.statusCode || 500,
        success: false,
        error_msg: error.message,
        body: null
    });
};

module.exports = errorHandler;
