const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const  = require('./utils/database');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1)
    .then(user =>  {
        // req.body.userId = user.id; // method 1
        req.user = user;  // method 2
        next();
    })
    .catch(err => console.log(err))
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

//----------------------------------
User.hasMany(Product);  // seller
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE'});
//----------------------------------
User.hasOne(Cart);
Cart.belongsTo(User);
//----------------------------------
// Many To Many
Cart.belongsToMany(Product, {through: CartItem })
Product.belongsToMany(Cart, {through: CartItem })
//----------------------------------
// One To Many
User.hasMany(Order)
Order.belongsTo(User);
Order.belongsToMany(Product, { through: OrderItem})


// app.listen(3000, () => {
//     console.log('app is runnning on : http://localhost:3000/');
//     .sync({/* force: true */})
//     .then(() => User.findByPk(1))
//     .then( user => {
//         if(!user) {
//             // initializing users for development
//             return User.create({ name:"Daniel", email:"daniel@email.com"})
//             .then(user => user.createCart())
//         }
//         return user;
//     })
//     .catch(err => console.log(err))
// });


app.listen(3000, () => {
    console.log('app is runnning on : http://localhost:3000/');
    .sync({/* force: true */})
    .then(() => User.findAll())
    .then( users => {
        if(users.length === 0) {
            // initializing users for development
                return Promise.all ([
                    User.create({ name:"Daniel", email:"daniel@email.com"}),
                    User.create({ name:"Julie", email:"julie@email.com"}),
                    User.create({ name:"Gaïa", email:"gaia@email.com"}),
                    User.create({ name:"Amaya", email:"amaya@email.com"})
            ])
            .then(users => users.map((user) => {
                return user.createCart()
            }))
        }
        return users;
    })
    .catch(err => console.log(err))
});



