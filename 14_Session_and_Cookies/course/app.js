// const path = require('path');

// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');

// const errorController = require('./controllers/error');
// const User = require('./models/user');

// const app = express();

// app.set('view engine', 'ejs');
// app.set('views', 'views');

// const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//   User.findById('5bab316ce0a7c75f783cb8a8')
//     .then(user => {
//       req.user = user;
//       next();
//     })
//     .catch(err => console.log(err));
// });

// app.use('/admin', adminRoutes);
// app.use(shopRoutes);

// app.use(errorController.get404);

// mongoose
//   .connect(
//     'mongodb+srv://maximilian:9u4biljMQc4jjqbe@cluster0-ntrwp.mongodb.net/shop?retryWrites=true'
//   )
//   .then(result => {
//     User.findOne().then(user => {
//       if (!user) {
//         const user = new User({
//           name: 'Max',
//           email: 'max@test.com',
//           cart: {
//             items: []
//           }
//         });
//         user.save();
//       }
//     });
//     app.listen(3000);
//   })
//   .catch(err => {
//     console.log(err);
//   });




require('dotenv').config();
const path = require('path');
const express = require('express');
const errorController = require('./controllers/error');
const mongoose = require('mongoose');
const User = require('./models/user');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
  User.findById('620629680736ff7f92a2263a')
  .then( user => {
    req.user = user;
    next();
  })
  .catch(err => console.log(err))
})


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);


app.use(errorController.get404);

const connectParams = { // not required on Mongoose v6
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
};
mongoose.connect(process.env.MONGO_URI, connectParams)
.then(() => {
  User.findOne()
  .then( user => {
    if(!user) {
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
