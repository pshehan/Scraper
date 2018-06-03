var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");

// Requiring models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

// Scraping tools
var request = require("request");
var cheerio = require("cheerio");

var port = process.env.PORT || 3000


var app = express();


app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));

// Set Handlebars
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
    defaultLayout: "main",
    partialsDir: path.join(__dirname, "/views/layouts/partials")
}));
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/skrape";

// Database configuration
mongoose.Promise = Promise;
mongoose.connect("mongodb://heroku_gcfr9nvt:13m5rqkr9blr4u5mchkm77thka@ds245240.mlab.com:45240/heroku_gcfr9nvt");
var db = mongoose.connection;

//error message
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

//success message 
db.once("open", function() {
  console.log("Mongoose connection successful.");
});


//GET requests
app.get("/", function(req, res) {
  Article.find({"saved": false}, function(error, data) {
    var hbsObject = {
      article: data
    };
    console.log(hbsObject);
    res.render("home", hbsObject);
  });
});

app.get("/saved", function(req, res) {
  Article.find({"saved": true}).populate("notes").exec(function(error, articles) {
    var hbsObject = {
      article: articles
    };
    res.render("saved", hbsObject);
  });
});

// A GET request to scrape r/nba
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  request("https://old.reddit.com/r/nba/", function(error, response, html) {
    // load into cheerio
    var $ = cheerio.load(html);
//grab every p.title
    $("p.title").each(function(i, element) {

      // Save an empty result object
      var result = {};

      // Add the title and link
      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");

//create new entry

      var entry = new Article(result);

//save to db
      entry.save(function(err, doc) {
        // Log errors
        if (err) {
          console.log(err);
        }
        // Or log doc
        else {
          console.log(doc);
        }
      });

    });
        res.send("Scrape Complete");
  });
});

// Get the articles from mongoDB
app.get("/articles", function(req, res) {
  // Grab every doc in the Articles array
  Article.find({}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser
    else {
      res.json(doc);
    }
  });
});

// Grab an article
app.get("/articles/:id", function(req, res) {
  // Prepare query 
  Article.findOne({ "_id": req.params.id })
  // populate notes
  .populate("note")
  // Execute query
  .exec(function(error, doc) {
    // Log errors
    if (error) {
      console.log(error);
    }
    // Send to browser as JSON object
    else {
      res.json(doc);
    }
  });
});


// Save
app.post("/articles/save/:id", function(req, res) {
      // Use the article id to find and update its saved boolean
      Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true})
      // Execute the above query
      .exec(function(err, doc) {
        // Log  error
        if (err) {
          console.log(err);
        }
        else {
          // Or send doc to browser
          res.send(doc);
        }
      });
});

// Delete 
app.post("/articles/delete/:id", function(req, res) {
      // Use the article id to find 
      Article.findOneAndUpdate({ "_id": req.params.id }, {"saved": false, "notes": []})
      // Execute the above query
      .exec(function(err, doc) {
        // Log  errors
        if (err) {
          console.log(err);
        }
        else {
          // Send doc to browser
          res.send(doc);
        }
      });
});


// Create note
app.post("/notes/save/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  var newNote = new Note({
    body: req.body.text,
    article: req.params.id
  });
  console.log(req.body)
  // And save the new note the db
  newNote.save(function(error, note) {
    // Log errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {
      // Use the article id to find notes
      Article.findOneAndUpdate({ "_id": req.params.id }, {$push: { "notes": note } })
      // Execute query
      .exec(function(err) {
        // Log error
        if (err) {
          console.log(err);
          res.send(err);
        }
        else {
          // Or send note to browser
          res.send(note);
        }
      });
    }
  });
});

// Delete note
app.delete("/notes/delete/:note_id/:article_id", function(req, res) {
  // Use the note id to find and delete
  Note.findOneAndRemove({ "_id": req.params.note_id }, function(err) {
    // Log error
    if (err) {
      console.log(err);
      res.send(err);
    }
    else {
      Article.findOneAndUpdate({ "_id": req.params.article_id }, {$pull: {"notes": req.params.note_id}})
       // Execute query
        .exec(function(err) {
          // Log error
          if (err) {
            console.log(err);
            res.send(err);
          }
          else {
            // Or send to browser
            res.send("Note Deleted");
          }
        });
    }
  });
});

// Listen on port
app.listen(port, function() {
  console.log("App running on port " + port);
});



