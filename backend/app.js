const express = require("express"),
  routes = require("./src/routes/_all.js"),
  config = require("./config.js"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose");

const fileUpload = require("express-fileupload");

app.use("/api/downloads", express.static(__dirname + "/downloads"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  fileUpload({
    useTempFiles: true,
    preserveExtension: true,
  })
);

routes(app);

mongoose.connect(config.database.mongodbUrl, function (err) {
  if (err) throw err;
  console.log("[DB] Mongoose connected");
});

app.listen(config.port, async () => {
  console.log(`[SERVER] Listening on port ${config.port}`);
});
