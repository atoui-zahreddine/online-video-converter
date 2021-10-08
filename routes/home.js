const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { baseUrl: process.env.URL });
});

module.exports = router;
