
// Using Express Router
const express = require('express');
const app = express();
const path = require('path');
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop');
const errorRoutes = require('./routes/error.js');


app.use(express.static(path.join(__dirname + '/public')));
app.use(express.urlencoded({ extended: false }));

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorRoutes);


app.listen(5500, () => {
    console.log(`Server is running on port 5500`);
});

//-------------------------------------------------------------------
