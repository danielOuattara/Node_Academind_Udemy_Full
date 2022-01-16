const path = require('path');
const express = require('express');
const rootDir = require('../util/path');
const homeRoutes = require('./home');
const router = express.Router();

router.get('/users', (req, res, next) => {
  const users = homeRoutes.users;
  res.render('users', {
    users,
    pageTitle: 'Users',
    path: '/users',
    hasProducts: users.length > 0,
    activeShop: true,
    productCSS: true
  });
});

module.exports = router;
