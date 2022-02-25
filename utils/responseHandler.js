const responseHandler = (res, data) => {
    return res.status(200).json({
        body: {
            success: true,
            error_msg: null,
            ...data
        }
    });
}

module.exports = responseHandler
