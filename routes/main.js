const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const ejsLayouts = require("express-ejs-layouts");
const bcrypt = require("bcrypt");
const passport = require("passport");

// importing user model
const User = require("../models/user");
const Track = require("../models/tarck");

// salt rounds for bcrypt
const saltRounds = 10;

const app = express();
const router = express.Router();

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

let errors = [];

/////////////////////////////// ROUTES START HERE //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get("/", (req, res) => {
  res.render("home");
});

router.get("/login", (req, res) => {
  if (req.user) {
    res.redirect("/dashboard");
  } else {
    res.render("login", { errors });
  }
});

router.get("/register", (req, res) => {
  res.render("register", { errors });
  errors = [];
});

////////////////////////////////  POST REGISTER ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post("/register", (req, res) => {
  // unpacking the object
  const { username, email, password, passwordConfirm } = req.body;

  // passwords match
  if (password !== passwordConfirm) {
    errors.push({ msg: "Passwords do not match" });
  }

  //password length check
  if (req.body.password.length < 6) {
    errors.push({ msg: "Length of the password must be atleast 6 characters" });
  }

  //if any errors
  if (errors.length > 0) {
    res.render("register", { errors });
    errors = [];
  } else {
    // when there are no errors in registration
    const user = new User({
      username,
      email,
      password,
    });

    //checking if the user already exists
    User.findOne({ email: email }, (err, userFound) => {
      if (err) throw err;
      if (userFound) {
        errors.push({ msg: "The email is already registered" });
        res.render("register", { errors });
        //empty the errors array
        errors = [];
      } else {
        // If the user with that email does not exist
        bcrypt.genSalt(saltRounds, (err, salt) => {
          if (err) throw err;
          bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) throw err;

            //setting the password to hash
            user.password = hash;
            // adding the user to database
            user.save();

            // sending a flash message
            req.flash("success_msg", "You are registered and can login");

            // Rendering the dashboard
            res.redirect("/login");
          });
        });
      }
    });
  }
});

/////////////////////////////////////// POST LOGIN /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You have successfully logged out");
  res.redirect("/login");
});

router.get("/getdata/:trackId", (req, res) => {
  Track.findOne({ _id: req.params.trackId }, (err, track) => {
    if (err) throw err;
    res.json(track);
  });
});

module.exports = router;
