
// const http = require('http')
// const express = require('express');
// const app  = express();
// const server = http.createServer()

// server.listen(5500, () => {
//   console.log(`Server is running on port 5500`)
// });

//-----------------------------------------------------------------


// const http = require('http')
// const express = require('express');
// const app  = express();
// const server = http.createServer(app)


// app.use((req, res, next) => {
//     console.log('in the 1st middleware');
//     next();
// });

// app.use((req, res, next) => {
//     console.log('in the 2nd middleware');
// });


// server.listen(5500, () => {
//   console.log(`Server is running on port 5500`)
// });
//-----------------------------------------------------------------

// const express = require('express');
// const app  = express();


// app.use((req, res, next) => {
//     console.log('in the 1st middleware');
//     next();
// });

// app.use((req, res, next) => {
//     console.log('in the 2nd middleware');
//     res.send("<h1>Express Framework</h1>") // new  ! 
// });

// app.listen(5500, () => {
//   console.log(`Server is running on port 5500`)
// });

//-------------------------------------------------------------------


// const express = require('express');
// const app = express();

// app.use('/', (req, res, next) => {
//     console.log('in the 1st middleware');
//     next();
// });

// app.use('/add-product', (req, res, next) => {
//     console.log('in the 2nd middleware');
//     res.send(`<h1>Add product !</h1>`);
// })

// app.use('/product', (req, res, next) => {
//     console.log(req.body);
//     res.redirect('/');
// });

// app.use('/', (req, res, next) => {
//     console.log('in the 4th middleware');
//     res.send("<h1>Hello form Express.js</h1>");
// });

// app.listen(5500, () => {
//     console.log(`Server is running on port 5500`)
// });


//-------------------------------------------------------------------

// const express = require('express');
// const app = express();
// const bodyParser = require('body-parser');

// // app.use(bodyParser.urlencoded({extended: false}))
// app.use(express.urlencoded({ extended: false }));


// app.use('/add-product', (req, res, next) => {
//     res.send(`
//         <form action='/product' method='POST'>
//             <label for="title"> Enter a Book title : </label>
//             <input type='text' name='title'/>
//             <button type='submit'>Send</button>
//         </form>`
//     );
// })

// app.use('/product', (req, res, next) => {
//     console.log(req.body);
//     res.redirect('/');
// });

// app.use('/', (req, res, next) => {
//     console.log('in the "/" middleware');
//     res.send("<h1>Hello form Express.js</h1>");
// });

// app.listen(5500, () => {
//     console.log(`Server is running on port 5500`)
// });

//-------------------------------------------------------------------

// const express = require('express');
// const app = express();
// const bodyParser = require('body-parser');

// // app.use(bodyParser.urlencoded({extended: false}))
// app.use(express.urlencoded({ extended: false }));


// app.use('/add-product', (req, res, next) => {
//     res.send(`
//         <form action='/product' method='POST'>
//             <label for="title"> Enter a Book title : </label>
//             <input type='text' name='title'/>
//             <button type='submit'>Send</button>
//         </form>`
//     );
// })

// app.post('/product', (req, res, next) => { // new !
//     console.log(req.body);
//     res.redirect('/');
// });

// app.use('/', (req, res, next) => {
//     console.log('in the "/" middleware');
//     res.send("<h1>Hello form Express.js</h1>");
// });

// app.listen(5500, () => {
//     console.log(`Server is running on port 5500`)
// });

//-------------------------------------------------------------------

// Using Express Router
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop');
const errorRoutes = require('./routes/error.js');
// app.use(bodyParser.urlencoded({extended: false}))
app.use(express.urlencoded({ extended: false }));


app.use(adminRoutes);
app.use(shopRoutes);
app.use(errorRoutes);


app.listen(5500, () => {
    console.log(`Server is running on port 5500`);
});

//-------------------------------------------------------------------
