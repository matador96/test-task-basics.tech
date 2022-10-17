const express = require("express"),
  routes = require("./src/routes/_all.js"),
  config = require("./config.js"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

routes(app);

mongoose.connect(config.database.mongodbUrl, function (err) {
  if (err) throw err;
  console.log("[DB] Mongoose connected");
});

app.listen(config.port, async () => {
  console.log(`[SERVER] Listening on port ${config.port}`);
});
