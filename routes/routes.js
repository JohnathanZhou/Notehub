var express = require('express');
var router = express.Router();
var models = require('../models');
var User = models.User;
var Product = models.Product;
var School = models.School;
var Review = models.Review;

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

router.post('/',function(req,res){
  var course = req.body.subject;
  //find all the notes that pretain to the course from the dropdown bar
  Product.find({subject: course}, function(err,docs){
    res.render('search',{ //renders the search page with all the notes
      notes:docs //docs has all the info of each product
    })
  })
})

router.get('/profile', function(req, res) {
  res.render('myprofile')
})

router.get('/newProduct', function(req, res) {
  res.render('newProduct')
})


router.post('/newProduct', function(req, res) {
  console.log(req.body);
  console.log(req.files)
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

router.get('/marketplace', function(req, res) {
  Product.find({school: req.user.school, subject:req.user.major})
  .populate('school')
  .populate('owner')
  .exec(
    function(err,doc){
      res.render('marketplace', {
        product:doc
      })
    })
  });
router.post('/marketplace', function(req,res){
  var find={
    subject: req.body.subject
  };
  var sort = {}
  if(req.body.sort = 'Rating'){
    sort = {
      owner.sellerrating: 1
    }
  }else if(req.body.sort = 'Price Ascending'){
    sort = {
      price: -1
    }
  }else{
    sort = {
      price: 1
    }
  }

  if('all'!==req.body.school){
    find.school=req.body.school;
  }
  Product.find(find)
  .populate('school')
  .populate('owner')
  .sort(req.)
})

  ///////////////////////////// END OF PRIVATE ROUTES /////////////////////////////

  module.exports = router;
