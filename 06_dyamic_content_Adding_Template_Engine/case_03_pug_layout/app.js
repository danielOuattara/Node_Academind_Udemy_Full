const path = require('path');
const express = require('express');
const app = express();



app.set("view engine", "pug");
app.set("views", "views")

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);



app.use((req, res, next) => {
    res.status(404).render('404',{pageTitle: '404 Not Found'});
});

app.listen(5500, () => {
    console.log('App is running on http://localhost:5500/')
});
