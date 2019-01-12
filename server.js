const express = require("express");
const expressHandlebars = require ("express-handlebars");
const logger = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");




// Require all models
//const db = require("./models");
  


const PORT = process.env.PORT || 3000;

// Initialize Express
const app = express();

// Configure middleware

//set up an Express Router
const router = express.Router();

//require our routes files pass out our router object
require("./config/routes")(router)

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static(__dirname +"/public"));

//Connect Handlebars to our Express app
app.engine("handlebars", expressHandlebars ({
  defaultLayout: "main"
}));
app.set ("view engine", "handlebars");


//Use BodyParser in our app
app.use(bodyParser.urlencoded ({
  extended: false
}));

// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

// Routes
// have every request to go through our router middleware
app.use(router);

// If developed, use the deployed database. Otherwise use the local mongoHeadlines database
// var db = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadLines";

//   //connect mongoose to our database
//   mongoose.connect(db, function (error){
//     if (error) {
//       console.log(error);
//     }
//     else {
//       console.log("mongoose connection is sucessful");
//     }

//   });

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
