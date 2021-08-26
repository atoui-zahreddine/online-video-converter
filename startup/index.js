module.exports = function (app) {
  require("./livereload")(app);
  require("./routes")(app);
};
