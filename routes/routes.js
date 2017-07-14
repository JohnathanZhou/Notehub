var express = require('express');
var router = express.Router();
var models = require('../models');
var User = models.User;

//////////////////////////////// PUBLIC ROUTES ////////////////////////////////
// Users who are not logged in can see these routes

router.get('/', function(req, res, next) {
  res.render('Notehub');
});

router.get('/login', function(req, res) {
  res.render('login')
})

router.get('/home', function(req, res) {
  res.render('home')
})

///////////////////////////// END OF PUBLIC ROUTES /////////////////////////////

router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/');
  } else {
    return next();
  }
});

//////////////////////////////// PRIVATE ROUTES ////////////////////////////////
// Only logged in users can see these routes

router.get('/protected', function(req, res, next) {
  res.render('protectedRoute', {
    username: req.user.username,
  });
});

///////////////////////////// END OF PRIVATE ROUTES /////////////////////////////

module.exports = router;
