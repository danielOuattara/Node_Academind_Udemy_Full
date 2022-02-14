const path = require('path');
const express = require('express');
const rootDir = require('../util/path');
const router = express.Router();


const products =  [];

router.get('/add-product', (req, res, next) => {
  res.render('add-product', {
    pageTitle:"Add-product", 
    pathToAddProduct: true,
    formsCSS: true,
    productCSS: true
        
  });
});

// /admin/add-product => POST
router.post('/add-product', (req, res, next) => {
  products.push({title: req.body.title})
  console.log("products ==== ", products)
  res.redirect('/');
});

// module.exports = router;

exports.routes = router;
exports.products = products;
