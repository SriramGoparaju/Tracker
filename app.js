const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const ejsLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");

const app = express();

//passport config
require("./config/passport")(passport);

//Connecting to mongoose
mongoose.connect("mongodb://127.0.0.1:27017/test", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.static("public"));

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

// EJS middleware
app.set("views", __dirname + "/views");
app.use(ejsLayouts);
app.set("view engine", "ejs");

// Session middleware
app.use(
  session({
    secret: "Hello World",
    saveUninitialized: false,
    resave: false,
  })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

// flash messages middleware
app.use(flash());

//GLobal variables for flash messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Router middleware
app.use("/", require("./routes/main"));
app.use("/dashboard", require("./routes/dashRoute"));

//constants
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`the server running at port ${PORT}`);
});
