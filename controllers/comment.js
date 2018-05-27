// Import the model 
var db = require("../models");

//Require express
var express = require("express");
var mongojs = require("mongojs");

module.exports = function(app) {

    //Grab a specific article by ID
    app.get("/articles/:id", function(req, res) {
        // Prepare a query that finds the matching DB
        db.Headline.findOne({ _id: req.params.id })
        //  populate notes 
        .populate("note")
        .then(function(dbHeadline) {
            // send to client
            res.json(dbHeadline);
        })
        .catch(function(err) {
            res.json(err);
        });
    });

    //Get all notes for article
    app.get("/notes/:id", function (req, res) {
        if(req.params.id) {
            db.Note.find({
                "headline": req.params.id
            })
            .exec(function (error, doc) {
                if (error) {
                    console.log(error)
                } else {
                    res.send(doc);
                }
            });
        }
    });

    //Create/post a new comment
    app.post("/notes", function (req, res) {
    if (req.body) {
        db.Note.create(req.body)
        .then(function(dbNote) {
            // send to client
            res.json(dbNote);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
    }
    });

    //Delete a note
    app.delete("/notes/:id", function(req, res) {
        // Id needs to be passed in
        db.Note.deleteOne({ _id: req.params.id },
            function(err, data) {
                if (err) {
                    console.log(err);
                }
                else {
                res.json(data);
                }
        });
    });
}
    

  