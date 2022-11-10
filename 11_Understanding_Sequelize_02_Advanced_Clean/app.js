require("dotenv").config();
const express = require("express");
const errorController = require("./controllers/errorControllers");
const sequelize = require("./utils/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");
const adminRoutes = require("./routes/adminRoutes");
const shopRoutes = require("./routes/shopRoutes");
const usersTestData = require("./data/usersTest.json");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

/* 
In the next middleware, we store in "req" object 
a sequelize object: "user"; with all properties & 
methods granted by Sequelize and relations/associations. 
So, "user" here is not a simple javascript object 
*/

app.use((req, res, next) => {
  User.findByPk(3) // change the number to target a specific user
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

//----------------------------------
// One to One
User.hasOne(Cart);
Cart.belongsTo(User);

//----------------------------------
// One To Many
User.hasMany(Product); // seller
Product.belongsTo(User, {
  constraints: true,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

User.hasMany(Order);
Order.belongsTo(User);

//----------------------------------
// Many To Many
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

//---------------------------------------------------------

// sequelize
//   .sync({ force: true })
//   .then(() => User.findAll())
//   .then((users) => {
//     if (users.length === 0) {
//       // initializing users for development
//       return Promise.all([
//         User.create({ name: "Daniel", email: "daniel@email.com" }),
//         User.create({ name: "Julie", email: "julie@email.com" }),
//         User.create({ name: "Gaïa", email: "gaia@email.com" }),
//         User.create({ name: "Amaya", email: "amaya@email.com" }),
//       ]).then((users) =>
//         users.map((user) => {
//           return user.createCart();
//         })
//       );
//     } else {
//       return users;
//     }
//   })
//   .then(() => {
//     console.log("Connection to MySql database : SUCCESS ");
//     return app.listen(3000);
//   })
//   .then(() => console.log("Server is running on http://localhost:3000/ "))
//   .catch((err) => console.log(err));

//---------------------------------------------------------

sequelize
  .sync({
    /* force: true  */
  })
  .then(() => User.findAll())
  .then((users) => {
    if (users.length === 0) {
      // initializing users for development
      usersTestData.forEach((person) => {
        User.create(person)
          .then((user) => user.createCart())
          .catch((err) => console.log(err));
      });
    } else {
      return users;
    }
  })
  .then(() => {
    console.log("Connection to MySql database : SUCCESS ");
    return app.listen(3000);
  })
  .then(() => console.log("Server is running on http://localhost:3000/ "))
  .catch((err) => console.log(err));
