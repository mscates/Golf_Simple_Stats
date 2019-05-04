var bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  mongoose = require("mongoose"),
  express = require("express"),
  moment = require("moment"),
  app = express(),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  Round = require("./models/round"),
  Comment = require("./models/comment"),
  User = require("./models/user"),
  seedDB = require("./seeds");

// Round.counterReset("_id", function(err) {});

seedDB();
// APP CONFIGURATION
mongoose.connect("mongodb://localhost:27017/golf_stats_app", {
  useNewUrlParser: true,
  useCreateIndex: true
});

// allows for view files to drop the .ejs extention when rendering
app.set("view engine", "ejs");
// allows for use of a custom style sheet
app.use(express.static("public"));
// allows for form data to be available in req.body
app.use(bodyParser.urlencoded({ extended: true }));
// setup method override for put requests
app.use(methodOverride("_method"));

// ALL THE ROUTES

app.get("/", function(req, res) {
  res.redirect("/golfstats");
});

//INDEX ROUTE
app.get("/golfstats", function(req, res) {
  Round.find({}, function(err, stats) {
    if (err) {
      console.log("Error");
    } else {
      res.render("rounds/index", { stats: stats, moment: moment });
    }
  });
});

// NEW ROUTE
app.get("/golfstats/new", function(req, res) {
  res.render("rounds/new");
});

// CREATE ROUTE
app.post("/golfstats", function(req, res) {
  Round.create(req.body.stats, function(err, newRound) {
    if (err) {
      res.status(400).send("unable to save to database");
    } else {
      res.redirect("/golfstats");
    }
  });
});

// DASHBOARD ROUTE
app.get("/golfstats/dashboard", function(req, res) {
  Round.find({}, function(err, stats) {
    if (err) {
      console.log("Error");
    } else {
      res.render("rounds/dashboard", { stats: stats });
    }
  });
});

// SHOW ROUTE
app.get("/golfstats/:id", function(req, res) {
  Round.findById(req.params.id)
    .populate("comments")
    .exec(function(err, foundRound) {
      if (err) {
        console.log(err);
      } else {
        console.log(foundRound);
        res.render("rounds/show", { stat: foundRound, moment: moment });
      }
    });
});

// EDIT ROUTE
app.get("/golfstats/:id/edit", function(req, res) {
  Round.findById(req.params.id, function(err, foundRound) {
    if (err) {
      res.redirect("/golfstats");
    } else {
      res.render("rounds/edit", { stat: foundRound });
    }
  });
});

// UPDATE ROUTE
app.put("/golfstats/:id", function(req, res) {
  Round.findByIdAndUpdate(req.params.id, req.body.stats, function(
    err,
    updatedRound
  ) {
    if (err) {
      res.redirect("/golfstats");
    } else {
      res.redirect("/golfstats/" + req.params.id);
    }
  });
});

// DELETE ROUTE
app.delete("/golfstats/:id", function(req, res) {
  Round.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/golfstats");
    } else {
      res.redirect("/golfstats");
    }
  });
});

// COMMENTS ROUTES

app.get("/golfstats/:id/comments/new", function(req, res) {
  Round.findById(req.params.id, function(err, round) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { round: round });
    }
  });
});

app.post("/golfstats/:id/comments", function(req, res) {
  Round.findById(req.params.id, function(err, round) {
    if (err) {
      console.log(err);
      res.redirect("/golfstats");
    } else {
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          console.log(err);
        } else {
          round.comments.push(comment);
          round.save();
          res.redirect("/golfstats/" + round._id);
        }
      });
    }
  });
});

var port = 1236;
app.listen(port, () => {
  console.log("Server Started!");
});
