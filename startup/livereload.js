const liverReload = require("livereload");
const connectLiveReloadServer = require("connect-livereload");

module.exports = function (app) {
  if (process.env.NODE_ENV === "development") {
    const liveReloadServer = liverReload.createServer();
    app.use(connectLiveReloadServer({ port: 35729 }));
    liveReloadServer.watch(__dirname);
    liveReloadServer.server.once("connection", () => {
      setTimeout(() => {
        liveReloadServer.refresh("/");
      }, 100);
    });
  }
};
