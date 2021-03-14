const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const localStrategy = require("passport-local").Strategy;
const User = require("../models/user");

module.exports = function (passport) {
  passport.use(
    new localStrategy({ usernameField: "email" }, (email, password, done) => {
      // Match User
      User.findOne({ email: email }, (err, user) => {
        if (err) throw err;
        if (!user) {
          return done(null, false, { message: "That email is not registered" });
        }

        //Match password
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) throw err;
          if (result) {
            return done(null, user);
          } else {
            return done(null, false, { message: "The password is incorrect" });
          }
        });
      });
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
