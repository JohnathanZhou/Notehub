var express = require('express');
var router = express.Router();
var models = require('../models');
var User = models.User;
var Product = models.Product;
var School = models.School;
var Review = models.Review;
var fs = require('fs')


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

router.get('/profile/:userid', function(req, res) {
  res.render('userprofile')
})

router.get('/newProduct', function(req, res) {
  res.render('newProduct')
})

router.get('/product/:id', function(req, res) {
  console.log(req.params.id);
  Product.findById(req.params.id)
  .exec(
    function(err,doc){
      console.log(doc);
      res.render('singleproduct',{
        product:doc
      })
      //res.json(doc)
    }
  )
})



router.post('/newProduct', function(req, res) {
  console.log(req.file);
  var img = req.file.mimetype.split('image/')
  console.log(img);
  var newProduct = new Product({
    name: req.body.name,
    pdf: req.file.path+'.'+img[1],
    owner: req.user._id,
    price: req.body.price,
    course: req.body.course,
    subject: req.body.subject,
    school: req.user.school,
    description: req.body.description
  })
  newProduct.save(function(err) {
    if (err) {
      console.log("product not saved");
    }
    else {
      console.log('Product saved!');
      Product.findOne({name: req.body.name, description: req.body.description}, function(err, product) {
        if (err) {
          console.log('error in finding saved product');
        }
        else {
          res.redirect('/product/'+product._id)
        }
      })
    }
  })
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
        product:doc,
        user: req.user
      })
    })
  });
  router.post('/marketplace', function(req,res){
    var find={
      subject: req.body.subject
    };
    if('all'!==req.body.school){
      find.school=req.body.school;
    }
    var sort = {}
    if(req.body.sort = 'Rating'){
      Product.find(find)
      .populate('school')
      .populate('owner')
      .sort(find)
      .exec(
        function(err,doc){
          doc=doc.sort(function(a,b){
            a.owner.sellerrating-b.owner.sellerrating
          })
          res.render('marketplace',{
            product:doc,
            user: req.user
          })
        }
      )
    }else if(req.body.sort = 'Price Ascending'){
      sort = {
        price: -1
      }
      Product.find(find)
      .populate('school')
      .populate('owner')
      .sort(find)
      .sort(sort)
      .exec(
        function(err,doc){
          res.render('marketplace',{
            product:doc,
            user: req.user
          })
        }
      )
    }else{
      sort = {
        price: 1
      }
      Product.find(find)
      .populate('school')
      .populate('owner')
      .sort(find)
      .sort(sort)
      .exec(
        function(err,doc){
          res.render('marketplace',{
            product:doc,
            user: req.user
          })
        }
      )
    }
  })


  ///////////////////////////// END OF PRIVATE ROUTES /////////////////////////////

  module.exports = router;
