const multer = require("multer");

module.exports = (err, req, res, next) => {
  //Catch multer error
  if (err instanceof multer.MulterError) {
    const errorMessages = {
      LIMIT_FILE_SIZE: "file size limit exceeded",
      LIMIT_UNEXPECTED_FILE: "file type not supported",
      LIMIT_FILE_COUNT: "file count limit exceeded",
    };

    return res.status(400).json({
      ok: err.code,
      message: errorMessages[err.code],
    });
  } else if (err) {
    res.status(500).send("Server error!");
  }
};
