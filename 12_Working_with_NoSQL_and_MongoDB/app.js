require('dotenv').config();
const path = require('path');
const express = require('express');
const errorController = require('./controllers/error');
const {mongoConnect} = require('./util/database')
const User = require('./models/user');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('62100bef40b787f4b717aefa')  // user manually created in Compass
  .then( user => {
    // req.user = user;
    req.user = new User(user.name, user.email, user.cart, user._id); 
    // Allows to access all method and properties available through assiociation
    
    next();
  })
  .catch(err => console.log(err))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
  app.listen(3000, () => console.log('App is running over http://localhost:3000/'))
})
