const path = require('path');
const express = require('express');
const rootDir = require('../util/path');
const router = express.Router();
const adminData = require('./admin');
const { products } = require('./admin');


router.get('/', (req, res, next) => {
  res.render('shop', {
    products: adminData.products, 
    pageTitle: 'Shop',
    pathToShop: true,
    hasProducts: products.length > 0 ? true : false,
    productCSS: true
  });
});

module.exports = router;
