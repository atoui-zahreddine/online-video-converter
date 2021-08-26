module.exports = function (app) {
  app.use(require("../routes/home"));
  app.use("/api/convert", require("../routes/convert.js"));
};
