var express = require("express");
var router = express.Router();
var Round = require("../models/round");
var moment = require("moment");

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
router.get("/new", function(req, res) {
  res.render("rounds/new");
});

// CREATE ROUTE
router.post("/", function(req, res) {
  Round.create(req.body.stats, function(err, newRound) {
    if (err) {
      res.status(400).send("unable to save to database");
    } else {
      res.redirect("/golfstats");
    }
  });
});

// DASHBOARD ROUTE
router.get("/dashboard", function(req, res) {
  Round.find({}, function(err, stats) {
    if (err) {
      console.log("Error");
    } else {
      res.render("rounds/dashboard", { stats: stats });
    }
  });
});

// SHOW ROUTE
router.get("/:id", function(req, res) {
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
router.get("/:id/edit", function(req, res) {
  Round.findById(req.params.id, function(err, foundRound) {
    if (err) {
      res.redirect("/golfstats");
    } else {
      res.render("rounds/edit", { stat: foundRound });
    }
  });
});

// UPDATE ROUTE
router.put("/:id", function(req, res) {
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
router.delete("/:id", function(req, res) {
  Round.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/golfstats");
    } else {
      res.redirect("/golfstats");
    }
  });
});

module.exports = router;
