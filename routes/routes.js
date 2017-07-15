var express = require('express');
var router = express.Router();
var models = require('../models');
var User = models.User;
var Product = models.Product;
var School = models.School;
var Review = models.Review;
var busboy = require('connect-busboy');
var fs = require('fs')
var multer = require('multer')
var upload = multer({ dest: 'files/' })

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
router.get('/marketplace', function(req,res){
  res.render('marketplace');
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
  res.render('userprofile')
})

router.get('/newProduct', function(req, res) {
  res.render('newProduct')
})

router.get('/product/:productid', function(req, res) {
  Product.findById(req.params.productid)
  .exec(
    function(err,doc){
      res.render('singleproduct',{
        product:doc
      })
    }
  )
})


router.post('/newProduct', upload.single('productImage'), function(req, res, next) {
  // console.log(req.body);
  // console.log(req.files)
  // res.render('home')
  // var fstream;
  // req.pipe(req.busboy);
  // req.busboy.on('file', function (fieldname, file, filename) {
  //     console.log("Uploading: " + filename);
  //     fstream = fs.createWriteStream(__dirname + '/files/' + filename);
  //     file.pipe(fstream);
  //     fstream.on('close', function () {
  //         res.redirect('home');
  //     });
  // });
//   fs.readFile(req.files.displayImage.path, function (err, data) {
//   // ...
//   var newPath = __dirname + "/files/" + 'req.files.filename';
//   fs.writeFile(newPath, data, function (err) {
//     res.redirect("/home");
//   });
// });
  console.log(req.file);
  res.send(200)

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
            product:doc
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
            product:doc
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
            product:doc
          })
        }
      )
    }
  })


  ///////////////////////////// END OF PRIVATE ROUTES /////////////////////////////

  module.exports = router;
