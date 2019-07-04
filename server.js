// If you want to earn complete credit for your work, you must use all five of these packages in your assignment.
var express = require("express");
// var xxxx = require("express-handlebars");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var axios = require("axios");

var db = require("./models");

// var PORT = 3000;

var app = express(); // initializes Express
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

axios.get("https://www.bbc.com/sport/football/womens").then(function (response) {
    var $ = cheerio.load(response.data);
    var results = [];

    $(".lakeside__content").each(function (i, element) {
        var title = $(element).children().children().children("span").text();
        var summary = $(element).children("p").text() || "N/A";
        var link = $(element).children().children().attr("href");
        if (!link.includes("https://www.bbc.co")) {
            link = "https://www.bbc.com" + link;
        }

        results.push({
            title: title,
            summary: summary,
            link: link
        });
    });
    console.log(results);
});