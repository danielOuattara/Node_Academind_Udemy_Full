// const http = require("http");
// const express = require("express");
// const app = express();
// const server = http.createServer();

// server.listen(5500, () => {
//   console.log(`Server is running on port 5500`);
// });

//-----------------------------------------------------------------

// const http = require("http");
// const express = require("express");
// const app = express();
// const server = http.createServer(app);

// app.use((req, res, next) => {
//   console.log("in the 1st middleware");
//   next();
// });

// app.use((req, res, next) => {
//   console.log("in the 2nd middleware");
// });

// server.listen(5500, () => {
//   console.log(`Server is running on port 5500`);
// });

//-----------------------------------------------------------------

// const express = require("express");
// const app = express();

// app.use((req, res, next) => {
//   console.log("in the 1st middleware");
//   next();
// });

// app.use((req, res, next) => {
//   console.log("in the 2nd middleware");
//   res.send("<h1>Express Framework</h1>"); // new  !
// });

// app.listen(5500, () => {
//   console.log(`Server is running on port 5500`);
// });

//-------------------------------------------------------------------

/* handling different routes 
-----------------------------*/

// const express = require("express");
// const app = express();

// app.use("/", (req, res, next) => {
//   console.log("in the 1st middleware");
//   next();
// });

// app.use("/add-product", (req, res, next) => {
//   console.log("in the 2nd middleware");
//   res.send(`<h1>Add product !</h1>`);
// });

// app.use("/product", (req, res, next) => {
//   console.log("req.body = ", req.body);
//   res.redirect("/");
// });

// app.use("/", (req, res, next) => {
//   console.log("in the home middleware");
//   res.send("<h1>Hello form Express.js</h1>");
// });

// app.listen(5500, () => {
//   console.log(`Server is running on port 5500`);
// });

//-------------------------------------------------------------------

/* handle response 
--------------------*/

// const express = require("express");
// const app = express();

// app.use(express.json()); // parse json body
// app.use(express.urlencoded({ extended: false })); // parse url like body

// app.use("/add-product", (req, res, next) => {
//   res.send(`
// <form action='/product' method='POST'>
//     <label for="title"> Enter a Book title : </label>
//     <input type='text' name='title'/>
//     <button type='submit'>Add Product</button>
// </form>`);
// });

// app.use("/product", (req, res, next) => {
//   console.log(req.body);
//   res.redirect("/");
// });

// app.use("/", (req, res, next) => {
//   console.log('in the "/" middleware');
//   res.send("<h1>Hello form Express.js</h1>");
// });

// app.listen(5500, () => {
//   console.log(`Server is running on port 5500`);
// });

//-------------------------------------------------------------------

/* limit request to POST 
------------------------ */

const express = require("express");
const app = express();

// app.use(bodyParser.urlencoded({extended: false}))
app.use(express.urlencoded({ extended: false }));

app.use("/add-product", (req, res, next) => {
  res.send(`
    <form action='/product' method='POST'>
        <label for="title"> Enter a Book title : </label>
        <input type='text' name='title'/>
        <button type='submit'>Send</button>
    </forms>`);
});

app.post("/product", (req, res, next) => {
  // new !
  console.log(req.body);
  res.redirect("/");
});

app.use("/", (req, res, next) => {
  console.log('in the "/" middleware');
  res.send("<h1>Hello form Express.js</h1>");
});

app.listen(5500, () => {
  console.log(`Server is running on port 5500`);
});

//-------------------------------------------------------------------

/* Using Express Router  : Next
-------------------------*/
