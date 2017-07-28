// Include Server Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Require NYT Schema
var NYTdb = require("./models/nyt");

// Create Instance of Express
var app = express();
// Sets an initial port. We'll use this later in our listener
var PORT = process.env.PORT || 3000;

// Run Morgan for Logging
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.text());
app.use(bodyParser.json({
  type: "application/vnd.api+json"
}));

app.use(express.static("./public"));

// -------------------------------------------------

// MongoDB Configuration configuration (Change this URL to your own DB)
mongoose.connect("mongodb://heroku_wcwhggk0:3eud08n47c1hj5on6ag47idrgr@ds045632.mlab.com:45632/heroku_wcwhggk0" || "mongodb://localhost/reactnyt");
var db = mongoose.connection;

db.on("error", function (err) {
  console.log("Mongoose Error: ", err);
});

db.once("open", function () {
  console.log("Mongoose connection successful.");
});

// -------------------------------------------------

// Main "/" Route. This will redirect the user to our rendered React application
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

// This is the route we will send GET requests to retrieve our most recent search data.
// We will call this route the moment our page gets rendered
app.get("/api", function (req, res) {

  // We will find all the records, sort it in descending order, then limit the records to 5
  NYTdb.find({}).sort([
    ["date", "descending"]
  ]).exec(function (err, doc) {
    if (err) {
      console.log(err);
    } else {
      res.send(doc);
    }
  });
});

// This is the route we will send DELETE requests to remove by id.
app.delete("/api/:id", function (req, res) {
  NYTdb.deleteOne({
      "_id": req.params.id
    })
    // Execute the above query
    .exec(function (err, doc) {
      // Log any errors
      if (err) {
        console.log(err);
      } else {
        // Or send the document to the browser
        res.send(doc);
      }
    });
});

// This is the route we will send POST requests to save each search.
app.post("/api", function (req, res) {
  console.log("Title: " + req.body.title);

  // Here we'll save the location based on the JSON input.
  // We'll use Date.now() to always get the current date time
  NYTdb.create(req.body, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.send("Saved Search");
    }
  });
});

// -------------------------------------------------

// Listener
app.listen(PORT, function () {
  console.log("App listening on PORT: " + PORT);
});