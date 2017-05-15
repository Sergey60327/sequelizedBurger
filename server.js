var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var exphbs = require('express-handlebars');
var log = require("loglevel");
var path = require("path");
//process.env.PORT ||

var port = process.env.PORT || 3000;
var app = express();

// Requiring our models for syncing
var db = require(path.join(__dirname, '/models'));
// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(process.cwd() + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
// Override with POST having ?_method=DELETE
app.use(methodOverride("_method"));
// Set Handlebars.

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
// Import routes and give the server access to them.
var routes = require("./controllers/burgers_controller.js");
app.use("/", routes);

app.use(function (err, req, res, next){
  console.error(err.stack);
  console.error('ERROR :(');
  res.status(500).send('whoops');
})

app.listen(port, function(){
  console.log("Port: ", port)
});
