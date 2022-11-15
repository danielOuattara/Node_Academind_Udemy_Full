// require("dotenv").config();
// const express = require("express");
// const { mongoConnect } = require("./util/database");
// const User = require("./models/userModel");
// const adminRoutes = require("./routes/adminRoutes");
// const shopRoutes = require("./routes/shopRoutes");
// const errorController = require("./controllers/errorControllers");

// const app = express();

// app.set("view engine", "ejs");
// app.set("views", "views");

// app.use(express.urlencoded({ extended: false }));
// app.use(express.static("public"));

// app.use((req, res, next) => {
//   User.findById("636ff8a1ef91c31b238441ca") // user manually created in Compass
//     .then((user) => {
//       // console.log("user = ", user);
//       // req.user = user;
//       req.user = new User(user.name, user.email, user.cart, user._id);
//       console.log("user = ", user);
//       // Allows to access all method and properties available through assiociation
//       next();
//     })
//     .catch((err) => console.log(err));
// });

// app.use("/admin", adminRoutes);
// app.use(shopRoutes);

// app.use(errorController.get404);

// mongoConnect(() => {
//   app.listen(3000, () =>
//     console.log("App is running over http://localhost:3000/")
//   );
// });

//---------------------------------------------------------- OK

require("dotenv").config();
const express = require("express");
const { mongoConnect } = require("./util/database");
const User = require("./models/userModel");
const adminRoutes = require("./routes/adminRoutes");
const shopRoutes = require("./routes/shopRoutes");
const errorController = require("./controllers/errorControllers");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use((req, res, next) => {
  User.findById("637263807ea0a30df830a838") // user manually created in Compass
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      console.log("user = ", user);
      // Allows to access all method and properties available through assiociation
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
  User.findAllUsers()
    .then((users) => {
      if (users.length === 0) {
        // initializing users for development
        // return Promise.all([
        //   new User("Daniel", "daniel@email.com", { items: [] }).save(),
        //   new User("Julie", "julie@email.com", { items: [] }).save(),
        //   new User("Gaïa", "gaia@email.com", { items: [] }).save(),
        //   new User("Amaya", "amaya@email.com", { items: [] }).save(),
        // ]);
        return Promise.all([
          new User("Daniel", "daniel@email.com").save(),
          new User("Julie", "julie@email.com").save(),
          new User("Gaïa", "gaia@email.com").save(),
          new User("Amaya", "amaya@email.com").save(),
        ]);
      } else {
        return users;
      }
    })
    .then((users) => {
      app.listen(3000);
    })
    .then(() => console.log("App is running over http://localhost:3000/"))
    .catch((err) => console.log(err));
});

//---------------------------------------------------------- OK

// require("dotenv").config();
// const express = require("express");
// const { mongoConnect } = require("./util/database");
// const User = require("./models/userModel");
// const adminRoutes = require("./routes/adminRoutes");
// const shopRoutes = require("./routes/shopRoutes");
// const errorController = require("./controllers/errorControllers");
// const usersTestData = require("./data/usersTest.json");

// const app = express();

// app.set("view engine", "ejs");
// app.set("views", "views");

// app.use(express.urlencoded({ extended: false }));
// app.use(express.static("public"));

// app.use((req, res, next) => {
//   User.findById("636ff7ba1f36380b97801d91") // user manually created in Compass
//     .then((user) => {
//       // console.log("user = ", user);
//       // req.user = user;
//       req.user = new User(user.name, user.email, user.cart, user._id);
//       console.log("user = ", user);
//       // Allows to access all method and properties available through assiociation
//       next();
//     })
//     .catch((err) => console.log(err));
// });

// app.use("/admin", adminRoutes);
// app.use(shopRoutes);

// app.use(errorController.get404);

// mongoConnect(() => {
//   User.findAllUsers()
//     .then((users) => {
//       if (users.length === 0) {
//         // initializing users for development
//         return usersTestData.map((person) => {
//           const { name, email, cart } = person;
//           return new User(name, email, cart).save();
//         });
//       } else {
//         return users;
//       }
//     })
//     .then((users) => {
//       console.log("users = ", users);
//       app.listen(3000);
//     })
//     .then(() => console.log("App is running over http://localhost:3000/"))
//     .catch((err) => console.log(err));
// });
