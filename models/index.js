var express = require("express");
var pgp = require("pg-promise")(/*options*/);
const { Client } = require("pg");
let results = [];
const app = express();

client.connect(err => {
  if (err) {
    console.error("connection error", err.stack);
  } else {
    console.log("connected");
  }
});

// var query = {
//   text: "SELECT id, name FROM student"
// };
//
// client.query(query, (err, res) => {
//   if (err) throw err;
//   // var myData = JSON.parse("res");
//
//   console.log(JSON.stringify(res.rows));
//   var results = JSON.stringify(res.rows);
//   aptData = results;
//   console.log(aptData + "this is the variable to export");
//   client.end();
// });

module.exports = client;
