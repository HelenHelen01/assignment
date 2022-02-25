const MyError = require("../utils/myerror");
const path = require('path')
const imageUpload = (file) => {
    if (!file.mimetype.startsWith('image')) {
        throw new MyError('Та зураг upload хийнэ үү.', 400)
    }

    if (file.size > process.env.MAX_UPLOAD_FILE_SIZE) {
        throw new MyError('Зурагны хэмжээ хэтэрсэн байна.', 400)
    }

    file.name = `photo_${Date.now().toString()}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, err => {
        if (err) {
            throw new MyError('Зураг хуулах явцад алдаа гарлаа.' + err.message, 400)
        }
    })
}

module.exports = imageUpload;
