// Import the model 
var db = require("../models");

//Require express
var express = require("express");
var mongojs = require("mongojs");

module.exports = function(app) {
    //Routes
   
    app.get("/", function(req, res) {
        //Query: in our database, go to the headlines collection, 
        //then "find" every article that is not saved (has a saved value of false).
        db.Article.find({saved: false}, function(error, found) {
            //Log any errors if the server encounters one.
            if (error) {
                console.log(error);
            }
            //Otherwise, send the result of this query to the browser.
            else {
                res.render("home", {
                    articles: found,
                    });
            }
        });
    });

    //At the /saved path, display/render the saved.handlebars file.
    app.get("/saved", function(req, res) {
        //Query: in our database, go to the articles collection, 
        //then "find" every article that is saved (has a saved value of true);
        db.Article.find({saved: true}, function(error, found) {
            //Log any errors if the server encounters one.
            if (error) {
                console.log(error);
            }
            //Otherwise, send the result of this query to the browser.
            else {
                res.render("saved", {
                    articles: found,
                    });
            }
        });
    });

    //This route will retrieve all of the data.
    //from the headlines collection as json (this will be populated by the data you scrape using the /scrape route.)
    app.get("/all", function(req, res) {
        //Query: in our database, go to the articles collection, then "find" everything.
        db.Article.find({}, function(error, found) {
            //Log any errors if the server encounters one.
            if (error) {
                console.log(error);
            }
            //Otherwise, send the result of this query to the browser.
            else {
                res.json(found);
            }
        });
    });

    //Mark a article as saved.
    app.put("/marksaved/:id", function(req, res) {
        //Remember: when searching by an id, the id needs to be passed in
        updateSaved(true,req, res);
    });
  
    //Mark an article as not saved.
    app.put("/markunsaved/:id", function(req, res) {
        //Remember: when searching by an id, the id needs to be passed in
        updateSaved(false,req, res);
    });

    //Function that marks an article as saved (saved: true) or not saved (saved: false).
    function updateSaved(isSaved, req, res) {
        db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: isSaved },
            function(err, data) {
                if (err) {
                    console.log(err);
                }
                else {
                res.json(data);
                }
        });
    }

    //Delete an article
    app.delete("/articles/:id", function(req, res) {
                db.Article.deleteOne({ _id: req.params.id },
            function(err, data) {
                if (err) {
                    console.log(err);
                }
                else {
                res.json(data);
                }
        });
        app.get('/foo', (req, res, next) => {
            const foo = JSON.parse(req.body.jsonString)
            // ...
          })

    });
}