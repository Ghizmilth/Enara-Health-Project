const express = require("express");
const app = express();
const bodyParser = require("body-parser");
// const controllers = require("./controllers");
// var db = require("./models");
var controllers = require("./controllers");

app.use(express.static(__dirname + "/public"));
// app.use(express.static("views"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/views/index.html");
  // res.render("index", { patientId: JSON.stringify(req.patientId) });
  // res.json({ patientId: req.query.patientId });
});

app.get("/api", controllers.api.index);
app.get("/api/patient", controllers.patient.index);

app.listen(process.env.PORT || 3000, function() {
  console.log("Express server is running on http://localhost:3000/");
});
