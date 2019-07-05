// If you want to earn complete credit for your work, you must use all five of these packages in your assignment.
var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var axios = require("axios");

var db = require("./models");

var PORT = process.env.PORT || 3000;

var app = express(); // initializes Express
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI); // { useNewUrlParser: true }

app.get("/scrape", function (req, res) {
    axios.get("https://www.bbc.com/sport/football/womens").then(function (response) {
        var $ = cheerio.load(response.data);

        $(".lakeside__content").each(function (i, element) {
            var result = {};
            result.title = $(element).children().children().children("span").text();
            result.summary = $(element).children("p").text() || "N/A";
            result.link = $(element).children().children().attr("href");
            if (!result.link.includes("https://www.bbc.co")) {
                result.link = "https://www.bbc.com" + result.link;
            }
            // console.log(result);

            db.Article.create(result).then(function (dbArticle) { // only add if doesn't already exist in db
                console.log(dbArticle);
            }).catch(function (err) {
                console.log(err);
            });
        });

        res.send("Scrape completed")
    });
});

app.get("/articles", function (req, res) {
    db.Article.find({}).then(function (dbArticle) {
        res.json(dbArticle);
    }).catch(function (err) {
        res.json(err);
    });
});

app.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(function (dbArticle) {
            res.json(dbArticle);
        }).catch(function (err) {
            res.json(err);
        });
});

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});