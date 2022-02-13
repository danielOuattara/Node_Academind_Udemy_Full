require('dotenv').config();
const path = require('path');
const express = require('express');
const errorController = require('./controllers/error');
const mongoose = require('mongoose');
const session = require('express-session');
const User = require('./models/user');
const MongoDBStore = require('connect-mongodb-session')(session);

const app = express();

const connectParams = { // not required on Mongoose v6
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(process.env.MONGO_URI, connectParams)
  .then(() => {
    User.findOne()
      .then(user => {
        if (!user) {
          const user = new User({
            name: "Daniel",
            email: "daniel@email.com",
            cart: {
              items: []
            }
          })
          user.save()
        }
      })
      .catch(err => console.log(err))
    console.log("Connected to  Database !")
    app.listen(3000, () => console.log('App is running on port http://localhost:3000/'))
  })
  .catch(err => console.log(err))


const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions'
})

app.set('view engine', 'ejs');
app.set('views', 'views');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'my_Secret',
  resave: false,
  saveUninitialized: false,
  store,
}));


app.use((req, res, next) => {
  if(!req.session.user) {
    return next();
  }
   User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err))
})


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

