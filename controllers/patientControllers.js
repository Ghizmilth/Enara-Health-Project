var client = require("../models");
let dbData = [];
// var { Client } = require("pg");

// GET
function index(req, res) {
  client.query(
    "SELECT id, drchrono_chart_id, first_name, last_name, avatar FROM public.users;",
    (err, resp) => {
      if (err) throw err;
      res.json(resp);
      client.end();
    }
  );
}

module.exports = {
  index: index
};
