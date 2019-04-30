var bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  mongoose = require("mongoose"),
  express = require("express"),
  moment = require("moment"),
  AutoIncrement = require("mongoose-sequence")(mongoose),
  app = express();

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

// CONFIGURATION OF MONGOOSE AND THE MODEL
var golfSchema = new mongoose.Schema(
  {
    _id: Number,
    created: { type: Date, default: Date.now },
    score: Number,
    fairways: Number,
    greens: Number,
    putts: Number
  },
  { _id: false }
);
golfSchema.plugin(AutoIncrement);

var Golf = mongoose.model("Golf", golfSchema);

Golf.counterReset("_id", function(err) {});

// ALL THE ROUTES

app.get("/", function(req, res) {
  res.redirect("/golfstats");
});

//INDEX ROUTE
app.get("/golfstats", function(req, res) {
  Golf.find({}, function(err, stats) {
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
  Golf.create(req.body.stats, function(err, newGolf) {
    if (err) {
      res.status(400).send("unable to save to database");
    } else {
      res.redirect("/golfstats");
    }
  });
});

// SHOW ROUTE
app.get("/golfstats/:id", function(req, res) {
  Golf.findById(req.params.id, function(err, foundRound) {
    if (err) {
      res.redirect("/golfstats");
    } else {
      res.render("show", { round: foundRound });
    }
  });
});

var port = 1236;
app.listen(port, () => {
  console.log("Server Started!");
});
