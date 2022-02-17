require('dotenv').config();
const path = require('path');
const express = require('express');
const errorController = require('./controllers/error');
// const db = require('./utils/database');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const { log } = require('console');

// db.execute('SELECT * FROM products')
// .then((result) => {
//     console.log(result[0]);
// })
// .catch( err => {
//     console.log(err);
// });


app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

app.listen(3000, () => console.log('app is runnning on : http://localhost:3000/'));
