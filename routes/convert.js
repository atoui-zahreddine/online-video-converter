const express = require("express");
const stream = require("stream");
const fs = require("fs/promises");
const path = require("path");
const webmToMp4 = require("webm-to-mp4");

const uploadFileMiddleware = require("../middlewares/uploadFile");

const router = express.Router();

const MAX_SIZE = 500 * 1024 * 1024;

async function convertWebmToMp4(filePath) {
  return Buffer.from(webmToMp4(Buffer.from(await fs.readFile(filePath))));
}

function setResponseHeaders(res, { filename, fileLength }) {
  res.set("Content-disposition", "attachment; filename=" + filename);
  res.set("Content-Type", "video/mp4");
  res.set("x-filename", filename);
  res.set("Content-Length", fileLength);
}

router.post(
  "/",
  uploadFileMiddleware({
    acceptedTypes: ["video/webm"],
    maxFileSize: MAX_SIZE,
  }).single("video"),
  async (req, res) => {
    try {
      const uploadedFilePath = path.join(
        __dirname,
        `../uploaded/${req.file.filename}`
      );
      const filename = req.file.originalname.split(".")[0] + "-converted.mp4";
      const file = await convertWebmToMp4(uploadedFilePath);
      const readStream = new stream.PassThrough();
      readStream.end(file);
      setResponseHeaders(res, {
        filename,
        fileLength: file.length,
      });
      readStream.pipe(res);
      await fs.unlink(uploadedFilePath);
    } catch (ex) {
      console.log(ex);
      res.status(500).send("server error");
    }
  }
);
module.exports = router;
