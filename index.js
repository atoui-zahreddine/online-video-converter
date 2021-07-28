const express = require("express");
const path = require("path");
const liverReload = require("livereload");
const connectLiveReloadServer = require("connect-livereload");
const liveReloadServer = liverReload.createServer();
const app = express();

const port = process.env.PORT || 4000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(connectLiveReloadServer({ port: 35729 }));
app.get("/", (req, res) => {
  res.render("index");
});
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use("/api/convert", require("./routes/convert.js"));

liveReloadServer.watch(__dirname);
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

app.listen(port, () => console.log(`server is running on port : ${port}`));
