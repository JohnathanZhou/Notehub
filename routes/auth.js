// Add Passport-related auth routes here.
var express = require('express');
var router = express.Router();
var models = require('../models');

module.exports = function(passport) {

  // GET registration page
  router.get('/signup', function(req, res) {
    res.render('signup');
  });

  router.post('/signup', function(req, res) {
    // validation step
    if (req.body.password!==req.body.passwordRepeat) {
      return res.render('signup', {
        error: "Passwords don't match."
      });
    }
    var school = req.body.university_select;
    if(school === 'Northwestern U'){
      school='59695fa2d1770b298c31c3bb'
    }else if(school === 'Hong Kong U'){
      school='59695fa2d1770b298c31c3bc'
    }else if(school === 'UC Berkeley'){
      school='59695fa2d1770b298c31c3ba'
    }else{
      school='59695fa2d1770b298c31c3b9'
    }
    var u = new models.User({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      major: req.body.major_select,
      school: school
    });
    u.save(function(err, user) {
      if (err) {
        console.log(err);
        res.status(500).redirect('/register');
        return;
      }
      console.log('saved to database',user);
      res.redirect('/login');
    });
  });

  // GET Login page
  router.get('/login', function(req, res) {
    res.render('login');
  });

  // POST Login page
  router.post('/login', passport.authenticate('local',{
    successRedirect: '/marketplace',
    failureRedirect: '/login'
  }));

  // GET Logout page
  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  return router;
};
