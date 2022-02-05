require('dotenv').config();
const path = require('path');
const express = require('express');
const errorController = require('./controllers/error');
const mongoose = require('mongoose');
const User = require('./models/user');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//   User.findById('61fc6cce1deb6e01781a3332')
//   .then( user => {
//     req.user = new User(user.name, user.email, user.cart, user._id);
//     next();
//   })
//   .catch(err => console.log(err))
// })

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("Connected to  Database !")
  app.listen(3000, () => console.log('App is running on port http://localhost:3000/'))
})
.catch(err => console.log(err))
