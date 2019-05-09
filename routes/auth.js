var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// root route
router.get("/", function(req, res) {
  res.redirect("/golfstats");
});

// show register form
router.get("/register", function(req, res) {
  res.render("register");
});

//handle sign up
router.post("/register", function(req, res) {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function() {
      res.redirect("/golfstats");
    });
  });
});

// show login form
router.get("/login", function(req, res) {
  res.render("login");
});

// handle login
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/golfstats",
    failureRedirect: "/login"
  }),
  function(req, res) {}
);

// logout route
router.get("/logout", function(req, res) {
  req.logout();
  req.flash("success", "Logged you out");
  res.redirect("/golfstats");
});

module.exports = router;
