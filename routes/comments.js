var express = require("express");
var router = express.Router({ mergeParams: true });
var Round = require("../models/round");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// new route
router.get("/new", middleware.isLoggedIn, function(req, res) {
  Round.findById(req.params.id, function(err, round) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { round: round });
    }
  });
});

// create route
router.post("/", middleware.isLoggedIn, function(req, res) {
  Round.findById(req.params.id, function(err, round) {
    if (err) {
      console.log(err);
      res.redirect("/golfstats");
    } else {
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          console.log(err);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          round.comments.push(comment);
          round.save();
          req.flash("success", "Successfully added comment");
          res.redirect("/golfstats/" + round._id);
        }
      });
    }
  });
});

// comment edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(
  req,
  res
) {
  Round.findById(req.params.id, function(err, foundRound) {
    if (err || !foundRound) {
      req.flash("error", "Cannot find that round");
      return res.redirect("back");
    }
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err) {
        res.redirect("back");
      } else {
        res.render("comments/edit", {
          round_id: req.params.id,
          comment: foundComment
        });
      }
    });
  });
});
// comment update route
router.put("/:comment_id", function(req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(
    err,
    updatedComment
  ) {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/golfstats/" + req.params.id);
    }
  });
});

// comment delete route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(
  req,
  res
) {
  Comment.findOneAndDelete(req.params.comment_id, function(err) {
    if (err) {
      res.redirect("back");
    } else {
      req.flash("success", "Comment deleted");
      res.redirect("/golfstats/" + req.params.id);
    }
  });
});

module.exports = router;
