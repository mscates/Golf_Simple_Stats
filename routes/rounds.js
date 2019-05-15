var express = require("express");
var router = express.Router();
var Round = require("../models/round");
var moment = require("moment");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// Round.counterReset("_id", function(err) {});

//INDEX ROUTE
router.get("/", function(req, res) {
  Round.find({}, function(err, stats) {
    if (err) {
      console.log("Error");
    } else {
      res.render("rounds/index", {
        stats: stats,
        moment: moment
      });
    }
  });
});

// NEW ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res) {
  res.render("rounds/new");
});

// CREATE ROUTE
router.post("/", middleware.isLoggedIn, function(req, res) {
  var score = req.body.score;
  var fairways = req.body.fairways;
  var greens = req.body.greens;
  var putts = req.body.putts;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newRound = {
    score: score,
    fairways: fairways,
    greens: greens,
    putts: putts,
    author: author
  };
  Round.create(newRound, function(err, newCreatedRound) {
    if (err) {
      res.status(400).send("unable to save to database");
    } else {
      res.redirect("/golfstats");
    }
  });
});

// DASHBOARD ROUTE
router.get("/dashboard", async function(req, res) {
  try {
    const userRounds = {};
    const round = await Round.find({});
    const rounds = round.filter(item => item.author.id.equals(req.user._id));
    userRounds.numRounds = rounds.length;
    for(i = 0; i < rounds.length; i++) {
      for(let propt in rounds[i].toObject()) {
        if(propt === 'score' || propt === 'fairways' || propt === 'greens' || propt === 'putts') {
          userRounds[propt] = rounds.reduce((total, currentObj) => {return total + currentObj[propt] / rounds.length; }, 0);
        }
      }
    };

    res.locals.userAvg = userRounds;

  } catch (err) {
    console.log(err);
  }

  res.render("rounds/dashboard");
});

// SHOW ROUTE
router.get("/:id", function(req, res) {
  Round.findById(req.params.id)
    .populate("comments")
    .exec(function(err, foundRound) {
      if (err || !foundRound) {
        req.flash("error", "Round not found");
        res.redirect("back");
      } else {
        console.log(foundRound);
        res.render("rounds/show", { stat: foundRound, moment: moment });
      }
    });
});

// EDIT ROUTE
router.get("/:id/edit", middleware.checkRoundOwnership, function(req, res) {
  Round.findById(req.params.id, function(err, foundRound) {
    res.render("rounds/edit", { stat: foundRound });
  });
});

// UPDATE ROUTE
router.put("/:id", middleware.checkRoundOwnership, function(req, res) {
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
router.delete("/:id", middleware.checkRoundOwnership, function(req, res, next) {
  Round.findById(req.params.id, function(err, round) {
    Comment.remove(
      {
        _id: {
          $in: round.comments
        }
      },
      function(err) {
        if (err) return next(err);
        round.remove();
        res.redirect("/golfstats");
      }
    );
  });
});

module.exports = router;
