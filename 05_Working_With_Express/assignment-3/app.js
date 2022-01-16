
const express = require('express');
const app = express();
const path = require('path');
const homeRoute = require('./routes/home')
const usersRoute = require('./routes/users')


app.use(express.static(path.join(__dirname + '/public')));
app.use(express.urlencoded({ extended: false }));

app.use(homeRoute);

app.use(usersRoute);

const PORT = 5500;
app.listen(PORT, () => {
    console.log(`Server Assignment-3 is running on port ${PORT}`)
});