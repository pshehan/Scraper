// Import the model 
var db = require("../models");

var express = require("express");
var mongojs = require("mongojs");
var cheerio = require("cheerio");
var axios = require("axios");

module.exports = function(app) {
  
    //scrape data,  save it to MongoDB.
    app.get("/scrape", function(req, res) {

        /// grab the body of the html
        axios.get("http://www.espn.com/nba/").then(function(response) {
            //load into cheerio
            var $ = cheerio.load(response.data)

            //root class is .contentitem__content
            $(".contentItem__content").each(function(i, element){
                //Save an empty result object.
                var result = {};
                //Save the title of each article
                result.title = $(this).find(".contentItem__title").text();
                //Save the link for each article
                result.link = "http://www.espn.com" + $(this).find("a").attr("href");
                //Save the image/photo associated with each article
                result.img = $(this).find(".media-wrapper").find(".media-wrapper_image").find("img").attr("data-default-src");
            res.json(result);
        });
    });
});
}