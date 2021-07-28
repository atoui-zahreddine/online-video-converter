const express = require("express");
const multer = require("multer");
const stream = require("stream");
const webmToMp4 = require("webm-to-mp4");

const router = express.Router();

router.post("/", multer().single("video"), async (req, res) => {
  try {
    const file = Buffer.from(webmToMp4(req.file.buffer), "base64");
    const readStream = new stream.PassThrough();
    readStream.end(file);
    const filename = req.file.originalname.split(".")[0] + "-converted.mp4";
    res.set("Content-disposition", "attachment; filename=" + filename);
    res.set("Content-Type", "video/mp4");
    res.set("x-filename", filename);
    res.set("Content-Length", `${file.length}`);
    readStream.pipe(res);
  } catch (ex) {
    console.log(ex.message);
    res.status(500).send("server error");
  }
});
module.exports = router;
