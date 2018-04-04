var client = require("../models");
let dbData = [];
// var { Client } = require("pg");

// GET
function index(req, res) {
  client.query(
    "SELECT drchrono_chart_id, first_name, last_name, avatar FROM public.users;",
    (err, resp) => {
      if (err) throw err;
      res.json(resp);
      // console.log(JSON.stringify(res.rows));
      // dbData = resp.rows;
      // console.log(dbData + " this is the variable to export");

      client.end();
    }
  );
}

module.exports = {
  index: index
};
