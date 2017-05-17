// Pull in required dependencies
var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var exphbs = require('express-handlebars');
var log = require("loglevel");
var path = require("path");

// Configure logging
console.log('process.env.NODE_ENV (in server.js) = ' + process.env.NODE_ENV);
if (process.env.NODE_ENV) { // Production
	console.log("Setting log level to ERROR");
	log.setLevel("ERROR");
} else { // Development
	var level = process.env.LOG_LEVEL || "DEBUG";
	console.log("Setting log level to " + level);
	log.setLevel(level);
}

// Set up Express Application
var app = express();
var port = process.env.PORT || 8080;

// Requiring our models for syncing
var db = require(path.join(__dirname, '/models'));

// Serve static content for the app from the 'public' directory
app.use(express.static(process.cwd() + '/public'));

// Override with POST having ?_method=PUT
app.use(methodOverride('_method'));

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Set Handlebars as the view engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Import routes and give the server access to them
require('./controllers/burgers_controller.js')(app);

// Syncing our sequelize models and then starting our express app
// Include the {force: true} parameter if you need to update the models
db.sequelize.sync().then(function() {
  app.listen(port, function() {
    console.log("My-Burger-Sequel is listening on PORT " + port);
  });
});
