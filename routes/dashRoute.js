const express = require("express");

// Requiring the models
const User = require("../models/user");
const Track = require("../models/tarck");

// importing auth file from config
const { ensureAuthenticated } = require("../config/auth");

const app = express();
const router = express.Router();

let errors = [];

/////////////////////////////// Dashboard GET //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get("/", ensureAuthenticated, (req, res) => {
  res.redirect("/dashboard/" + req.user._id);
});

//  /dashboard/id
router.get("/:id", ensureAuthenticated, (req, res) => {
  Track.find({ userId: req.params.id }, (err, tracks) => {
    if (err) throw err;
    if (tracks) {
      tracks.push({ username: req.user.username, _id: req.user._id });
      res.render("dashboard", { tracks: tracks });
    } else {
      console.log("no tracks available");
    }
  });
});

////////////////////////////////  ADD Track method /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// GET METHOD
router.get("/:id/add", ensureAuthenticated, (req, res) => {
  User.findOne({ _id: req.params.id }, (err, user) => {
    if (err) throw err;
    if (!user) {
      req.flash("error_msg", "Something went wrong. Please login again");
      res.redirect("/login");
    } else {
      res.render("addTrack", req.user);
    }
  });
});

// POST METHOD
router.post("/:id/add", ensureAuthenticated, (req, res) => {
  //check if the user exists
  User.findOne({ _id: req.params.id }, (err, user) => {
    if (err) throw err;
    if (!user) {
      req.flash("error_msg", "Something went wrong. Please login again");
      res.redirect("/login");
    } else {
      // if exists then take the post information
      const { trackName, category, goal, comments } = req.body;

      // check if the track with the same name exists for the same user
      Track.findOne(
        { trackName: trackName, userId: req.params.id },
        (err, track) => {
          if (err) throw err;
          if (track) {
            req.flash("error_msg", "The track with that name already exists");
            res.redirect("/dashboard/" + req.params._id + "/add");
          }
        }
      );

      // track name is unique then save to DB
      const track = new Track({
        userId: req.params.id,
        trackName: trackName,
        category: category,
        goal: goal,
        comments: comments,
      });

      track.save((err, track) => {
        if (err) throw err;
        if (track) {
          req.flash("success_msg", "The track has been successfully added");
          res.redirect("/dashboard");
        } else {
          req.flash(
            "error_msg",
            "Oops. Something went wrong. Please try again"
          );
          res.redirect("/dashboard/" + req.params.id + "/add");
        }
      });
    }
  });
});

///////////////////////////////// SUBMIT track data ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// GET REQUEST
router.get("/:id/submit/:trackId", ensureAuthenticated, (req, res) => {
  //accessing the track using track id
  Track.findOne({ _id: req.params.trackId }, (err, track) => {
    if (err) throw err;
    if (!track) {
      req.flash("error_msg", "Data not added. Try again");
      res.redirect(
        "/dashboard/" + req.params.id + "/submit/" + req.params.trackId
      );
    } else {
      // track contains userId for posting data url and all the track info including data submitted
      res.render("trackPage", track);
    }
  });
});

// DATA POSTED
router.post("/:id/submit/:trackId", (req, res) => {
  Track.findOne({ _id: req.params.trackId }, (err, track) => {
    if (!track.data) {
      let day = req.body.day;
      let passedData = {};
      passedData[day] = [req.body.day, req.body.hours, req.body.remarks];
      Track.updateOne(
        { _id: req.params.trackId },
        { data: passedData },
        (err) => {
          if (err) throw err;
          else {
            req.flash("success_msg", "The data has been successfully added");
            res.redirect(
              "/dashboard/" + req.params.id + "/submit/" + req.params.trackId
            );
          }
        }
      );
    } else {
      var prevData = track.data;
      var day = req.body.day;
      prevData[day] = [req.body.day, req.body.hours, req.body.remarks];
      Track.updateOne(
        { _id: req.params.trackId },
        { data: prevData },
        (err) => {
          if (err) throw err;
          else {
            req.flash("success_msg", "The data has been successfully added");
            res.redirect(
              "/dashboard/" + req.params.id + "/submit/" + req.params.trackId
            );
          }
        }
      );
    }
  });

  // add data to the corrseponding track
});

// ensure authenticated removed for coding
router.get("/:userId/visualise", (req, res) => {
  Track.find({ userId: req.params.userId }, (err, tracks) => {
    res.render("visualise", { tracks: tracks });
  });
});

let values = [];
// ensure authenticated removed for coding
router.get("/:userId/visualise/:trackId", (req, res) => {
  Track.findOne({ _id: req.params.trackId }, (err, track) => {
    if (err) throw err;
    res.render("vis_specific", { track: track });
  });
});

module.exports = router;
