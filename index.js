const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 4000;

require("dotenv").config();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "public")));

require("./startup/index")(app);

app.listen(port, () => console.log(`server is running on port : ${port}`));
