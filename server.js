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
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.get("/", function (req, res) { // route for getting all scraped articles
    db.Article.find({})
        .then(function (dbArticle) {
            res.render("index", { dbArticle })
        }).catch(function (err) {
            res.json(err);
        });
});

app.get("/scrape", function (req, res) { // route for scraping bbc news articles
    axios.get("https://www.bbc.com/sport/football/womens").then(function (response) {
        var $ = cheerio.load(response.data);

        $(".lakeside__content").each(function (i, element) {
            var result = {};
            result.title = $(element).children().children().children("span").text();
            result.summary = $(element).children("p").text() || "No summary available.";
            result.link = $(element).children().children().attr("href");
            if (!result.link.includes("https://www.bbc.co")) {
                result.link = "https://www.bbc.com" + result.link;
            }
            result.saved = false;

            db.Article.updateOne(
                { link: result.link },
                {
                    $set: {
                        title: result.title,
                        summary: result.summary,
                        link: result.link,
                        saved: false
                    }
                },
                { upsert: true }
            ).then(function (dbArticle) {
                // console.log(dbArticle);
            }).catch(function (err) {
                console.log(err);
            });
        });
        res.send("Scrape completed")
    });
});

app.post("/articles/:id", function (req, res) { // route for saving/deleting specified article
    db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { saved: req.body.saved } }
    ).then(function (dbArticle) {
        res.json(dbArticle);
    }).catch(function (err) {
        console.log(err);
    });
});

app.get("/articles", function (req, res) { // route for getting all saved articles
    db.Article.find({})
        .then(function (dbArticle) {
            res.render("articles", { dbArticle })
        }).catch(function (err) {
            res.json(err);
        });
});

app.get("/notes/:id", function (req, res) { // route for getting one article by id and its notes (displayed in modal)
    db.Article.findOne({ _id: req.params.id })
        .populate("notes")
        .then(function (dbArticle) {
            res.json(dbArticle.notes);
        }).catch(function (err) {
            res.json(err);
        });
});

app.post("/notes/:id", function (req, res) { // route for adding new note on specified article
    db.Note.create(req.body)
        .then(function (dbArticle) {
            return db.Article.findOneAndUpdate(
                { _id: req.params.id },
                { $push: { notes: dbArticle._id } },
                { new: true }
            );
        }).then(function (dbArticle) {
            res.json(dbArticle);
        }).catch(function (err) {
            res.json(err);
        });
});

app.delete("/notes/:id", function (req, res) { // route for deleting notes
    db.Note.deleteOne({ _id: req.params.id })
        .then(function (dbArticle) {
            res.json(dbArticle);
        }).catch(function (err) {
            res.json(err);
        });
});

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});