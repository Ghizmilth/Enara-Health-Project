var app = require("express")();
var url =
  "https://apiusa.lookinbody.com/inbody/GetFullInBodyDataByID/API-KEY=JDogVoPK90inlZk6FQdaDxLx32i3vkxRW/WqVTZ0Vmc=/test";

app.get("/", function(req, res) {
  res.render(url);
});

var server = app.listen(3000, function() {
  var host = server.address().address;
  host = host === "::" ? "localhost" : host;
  var port = server.address().port;

  console.log("listening at http://%s:%s", host, port);
});
