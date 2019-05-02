var bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  mongoose = require("mongoose"),
  express = require("express"),
  moment = require("moment"),
  app = express(),
  Round = require("./models/round");

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
      res.render("index", { stats: stats, moment: moment });
    }
  });
});

// NEW ROUTE
app.get("/golfstats/new", function(req, res) {
  res.render("new");
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

// SHOW ROUTE
app.get("/golfstats/:id", function(req, res) {
  Round.findById(req.params.id, function(err, foundRound) {
    if (err) {
      res.redirect("/golfstats");
    } else {
      res.render("show", { stat: foundRound, moment: moment });
    }
  });
});

// EDIT ROUTE
app.get("/golfstats/:id/edit", function(req, res) {
  Round.findById(req.params.id, function(err, foundRound) {
    if (err) {
      res.redirect("/golfstats");
    } else {
      res.render("edit", { stat: foundRound });
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

// DASHBOARD ROUTE
app.get("/dashboard", function(req, res) {
  Round.find({}, function(err, stats) {
    if (err) {
      console.log("Error");
    } else {
      res.render("dashboard", { stats: stats });
    }
  });
});

var port = 1236;
app.listen(port, () => {
  console.log("Server Started!");
});
