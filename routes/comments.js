var express = require("express");
var router = express.Router({ mergeParams: true });
var Round = require("../models/round");
var Comment = require("../models/comment");

// new route
router.get("/new", isLoggedIn, function(req, res) {
  Round.findById(req.params.id, function(err, round) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { round: round });
    }
  });
});

// create route
router.post("/", isLoggedIn, function(req, res) {
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

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
