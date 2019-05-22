let bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  mongoose = require("mongoose"),
  express = require("express"),
  app = express(),
  passport = require("passport"),
  flash = require("connect-flash"),
  LocalStrategy = require("passport-local"),
  User = require("./models/user"),
  seedDB = require("./seeds");

let commentRoutes = require("./routes/comments"),
  roundRoutes = require("./routes/rounds"),
  authRoutes = require("./routes/auth");

// seedDB();
// APP CONFIGURATION
let url = process.env.DATABASEURL || "mongodb://localhost:27017/golf_stats_app"
mongoose.connect(url, {
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
app.use(flash());

// PASSPORT CONFIGURATION
app.use(
  require("express-session")({
    secret: "Golf Stats",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// use currentUser in all routes
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use(authRoutes);
app.use("/golfstats", roundRoutes);
app.use("/golfstats/:id/comments", commentRoutes);

const port = process.env.PORT || 1236;
app.listen(port, "0.0.0.0", () => {
  console.log("Server Started!");
});


