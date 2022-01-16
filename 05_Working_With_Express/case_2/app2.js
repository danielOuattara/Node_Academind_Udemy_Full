
// Using Express Router
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const adminRoutes = require('./routes2/admin')
const shopRoutes = require('./routes2/shop');
const errorRoutes = require('./routes2/error.js');
// app.use(bodyParser.urlencoded({extended: false}))
app.use(express.urlencoded({ extended: false }));


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorRoutes);


app.listen(5500, () => {
    console.log(`Server is running on port 5500`);
});

//-------------------------------------------------------------------
