//Importing Express and getting the router object 
var express = require('express');
var router = express.Router();

//connecting to the database
var mongoose = require('mongoose');

 mongoose.connect('mongodb://localhost/solar',function(err) {
  if (err) {
    console.log('Failed connecting to MongoDB!');
  } else {
    console.log('Successfully connected to MongoDB!');
  }
});

//Define schema
 var ProductSchema = new mongoose.Schema({
    Model: String,
    SolarPanel: String,
    Controller: String,
    Inverter: String,
    Battery: String,
    DailyOutput: String
});

//Define model
 var Product = mongoose.model('Product', ProductSchema);

//Seed data
 var products = [
   {
   'Model': 'KIG01',
   'SolarPanel': '800W',
   'Controller': '48V30A',
   'Inverter': '2KW',
   'Battery': '150AH*4',
   'DailyOutput': '2.56-4.08KW'
 },
 {
   'Model': 'KIG02',
   'SolarPanel': '1.2KW',
   'Controller': '48V30A',
   'Inverter': '3KW',
   'Battery': '250AH*4',
   'DailyOutput': '3.84-5.76KW'
 },
 {
   'Model': 'KIG03',
   'SolarPanel': '2KW',
   'Controller': '96V30A',
   'Inverter': '5KW',
   'Battery': '150AH*8',
   'DailyOutput': '6.4-10.2KW'
 }
];

//Insert the seed data to the database
products.forEach(function (product, index) {
  Product.find({ 'Model': product.Model }, function(err, products) {
  	if (!err && !products.length) {
      Product.create(product);
  	}
  });
});

//Get all the products
router.get('/', function(req, res) {
  Product.find({}, function(err, products) {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json(products);
  });
});

//Create a new product
router.post('/', function(req, res) {
  var product = req.body;
  Product.find({ 'Model': product.Model }, function(err, products) {
  	if (!err && !products.length) {
      Product.create(product, function(err, product) {
        if (err) {
          return res.status(500).json({ err: err.message });
        }
        res.json(product);
      });
  	}
  });
});

//Get a product with its id
router.get('/:id', function(req, res) {
 Product.findById(req.params.id, function(err, product) {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json(product);
  });
});

//Edit a product's details
router.put('/:id', function(req, res) {
  var id = req.params.id;
  var product = req.body;
  if (product && product._id !== id) {
    return res.status(500).json({ err: "Ids don't match!" });
  }
  Product.findByIdAndUpdate(id, product, {new: true}, function(err, product) {
    if (err) {
      return res.status(500).json({ err: err.message });
    }
    res.json(product);
  });
});

//Delete a product
router.delete('/:id', function(req, res) {
  Product.remove({
        _id : req.params.id
    }, function(err, product) {
      if (err) {
        return res.status(500).json({ err: err.message });
      }
      res.json(product);
    });
});

//Export the router
module.exports = router;
