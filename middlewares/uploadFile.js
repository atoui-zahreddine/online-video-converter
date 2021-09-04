const multer = require("multer");
const { MulterError } = require("multer");

module.exports = ({ acceptedTypes, maxFileSize }) => {
  return multer({
    limits: {
      fileSize: maxFileSize,
    },
    storage: multer.diskStorage({
      destination: "uploaded",
      filename(req, file, callback) {
        callback(null, file.originalname);
      },
    }),
    fileFilter(req, file, callback) {
      if (acceptedTypes.indexOf(file.mimetype) < 0) {
        return callback(
          new MulterError("LIMIT_UNEXPECTED_FILE", file.filename)
        );
      }
      callback(null, true);
    },
  });
};
