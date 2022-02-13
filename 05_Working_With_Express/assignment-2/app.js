
const express = require('express');
const app = express();

// app.use((res, req, next) => {
//     console.log('in the 1st middleware');
//     next();
// });

// app.use((req, res, next) => {
//     console.log('in the 2nd middleware');
//     res.send("<h1>Express Framework</h1>")
// })


app.use('/user', (req, res, next) => {
    console.log('in the 2nd middleware');
    res.send("<h1>user route </h1>");
});


app.use('/',(req, res, next) => {
    console.log('user route');
    res.send("<h1>home route </h1>");
});


const PORT = 5500;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});