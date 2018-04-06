require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var pgp = require("pg-promise")(/*options*/);
const { Client } = require("pg");
let results = [];


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
// app.get("/api/patient", controllers.patient.index);

app.get("/api/patient", (req, res) => {

  const client = new Client({
    host: process.env.DB_HOST,
    port: 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: true
  });

  client.connect(err => {
    if (err) {
      console.error("connection error", err.stack);
    } else {
      console.log("connected");
    }
  });

  client.query(
    "SELECT id, drchrono_chart_id, first_name, last_name, avatar FROM public.users;",
    (err, resp) => {
      if (err) throw err;
      res.json(resp);
      // client.end();
    }
  );
})

app.listen(process.env.PORT || 3000, function() {
  console.log("Express server is running on http://localhost:3000/");
});
