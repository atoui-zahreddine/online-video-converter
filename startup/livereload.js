module.exports = function (app) {
  if (process.env.NODE_ENV === "development") {
    const path = require("path");
    const liverReload = require("livereload");
    const connectLiveReloadServer = require("connect-livereload");
    app.use(
      connectLiveReloadServer({ port: 35729, ignore: [".mp4", ".webm"] })
    );

    const liveReloadServer = liverReload.createServer();
    liveReloadServer.watch(path.join(__dirname, "../public"));
    liveReloadServer.server.once("connection", () => {
      setTimeout(() => {
        liveReloadServer.refresh("/");
      }, 100);
    });
  }
};
