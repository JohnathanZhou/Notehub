var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI;

// If you're getting an error here, it's probably because
// your connect string is not defined or incorrect.
mongoose.connect(connect);

// Step 1: Write your schemas here!
// Remember: schemas are like your blueprint, and models
// are like your building!
var userSchema = mongoose.Schema({
  name: String,
  password: String,
  email: String,
  major: String,
  school: {
    type: mongoose.Schema.ObjectId,
    ref: 'School'
  },
  classes: String,
  sellerrating: Number,
  notes: Array
});

var productSchema = mongoose.Schema({
  name: String,
  pdf: String,
  owner: String,
  price: String,
  course: Object,
  school: String,
  description: String
});

var schoolSchema = mongoose.Schema({
  name: String,
  major: Array
})

var reviewSchema = mongoose.Schema({
  owner:{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  content:String,
  rating: Number
});

// Step 2: Create all of your models here, as properties.
var User = mongoose.model('User', userSchema);
var Product = mongoose.model('Restaurant', productSchema);
var Review = mongoose.model('Review', reviewSchema);
var School = mongoose.model('School',schoolSchema)
// Step 3: Export your models object
module.exports  = {
  User: User,
  Product: Product,
  Review: Review,
  School: School
}
