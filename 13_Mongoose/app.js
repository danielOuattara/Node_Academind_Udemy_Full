// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const User = require("./models/userModel");
// const errorControllers = require("./controllers/errorControllers");

// const app = express();

// app.set("view engine", "ejs");
// app.set("views", "views");

// const adminRoutes = require("./routes/adminRoutes");
// const shopRoutes = require("./routes/shopRoutes");

// app.use(express.urlencoded({ extended: false }));
// app.use(express.static("public"));

// app.use((req, res, next) => {
//   User.findById("6373863da0a6a98f3fd2503c")
//     .then((user) => {
//       req.user = user; // here user is a full mongoose model: with all method and properties
//       next();
//     })
//     .catch((err) => console.log(err));
// });

// app.use("/admin", adminRoutes);
// app.use(shopRoutes);

// app.use(errorControllers.get404);

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     return User.findOne();
//   })
//   .then((user) => {
//     if (!user) {
//       const user = new User({
//         name: "Daniel",
//         email: "daniel@email.com",
//         cart: {
//           items: [],
//         },
//       });
//       return user.save();
//     }
//   })
//   .then(() => {
//     console.log("Connection to MongoDB database : SUCCESS ");
//     app.listen(3000, () =>
//       console.log("App is running on port http://localhost:3000/")
//     );
//   })
//   .catch((err) => console.log(err));

//==

//---------------------------------------------------------- OK

// require("dotenv").config();
// const express = require("express");
// const User = require("./models/userModel");
// const mongoose = require("mongoose");
// const adminRoutes = require("./routes/adminRoutes");
// const shopRoutes = require("./routes/shopRoutes");
// const errorControllers = require("./controllers/errorControllers");

// const app = express();

// app.set("view engine", "ejs");
// app.set("views", "views");

// app.use(express.urlencoded({ extended: false }));
// app.use(express.static("public"));

// // simulating logging for a user
// app.use((req, res, next) => {
//   User.findById("6373863da0a6a98f3fd2503c") // user manually created in Compass
//     .then((user) => {
//       req.user = user;
//       console.log("user = ", user);
//       // Allows to access all method and properties available through assiociation
//       next();
//     })
//     .catch((err) => console.log(err));
// });

// app.use("/admin", adminRoutes);
// app.use(shopRoutes);

// app.use(errorControllers.get404);

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     return User.find();
//   })
//   .then((users) => {
//     // if (users.length === 0) {
//     //   return Promise.all([
//     //     new User({ name: "Daniel", email: "daniel@email.com" }).save(),
//     //     new User({ name: "Julie", email: "julie@email.com" }).save(),
//     //     new User({ name: "Gaïa", email: "gaia@email.com" }).save(),
//     //     new User({ name: "Amaya", email: "amaya@email.com" }).save(),
//     //   ]);
//     // }
//     if (users.length === 0) {
//       return Promise.all([
//         User.create({ name: "Daniel", email: "daniel@email.com" }),
//         User.create({ name: "Julie", email: "julie@email.com" }),
//         User.create({ name: "Gaïa", email: "gaia@email.com" }),
//         User.create({ name: "Amaya", email: "amaya@email.com" }),
//       ]);
//     } else {
//       return users;
//     }
//   })
//   .then((users) => {
//     app.listen(3000);
//   })
//   .then(() => console.log("App is running over http://localhost:3000/"))
//   .catch((err) => console.log(err));

//---------------------------------------------------------- OK

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/userModel");
const adminRoutes = require("./routes/adminRoutes");
const shopRoutes = require("./routes/shopRoutes");
const errorControllers = require("./controllers/errorControllers");
const usersTestData = require("./data/usersTest.json");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use((req, res, next) => {
  User.findById("6373863da0a6a98f3fd2503c") // user manually created in Compass
    .then((user) => {
      req.user = user;
      console.log("user = ", user);
      // Allows to access all method and properties available through assiociation
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(errorControllers.get404);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connexion Successfull to MongoDB Atlas !");
    return User.find();
  })
  .then((users) => {
    // if (users.length === 0) {
    //   // initializing users for development
    //   return usersTestData.map((person) => {
    //     const { name, email } = person;
    //     return new User({ name, email }).save();
    //   });
    // }
    if (users.length === 0) {
      // initializing users for development
      return usersTestData.map((person) => {
        const { name, email } = person;
        return User.create({ name, email });
      });
    } else {
      return users;
    }
  })
  .then((users) => {
    app.listen(3000);
  })
  .then(() => console.log("App is running over http://localhost:3000/ OK ?"))
  .catch((err) => console.log(err));
