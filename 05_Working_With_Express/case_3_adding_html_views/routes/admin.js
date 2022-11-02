const express = require("express");
const router = express.Router();
const path = require("path");

// router.get('/add-product', (req, res, next) => {
//     res.send(`
//         <form action='/admin/product' method='POST'>
//             <label for="title"> Enter a Book title : </label>
//             <input type='text' name='title'/>
//             <button type='submit'>Send</button>
//         </form>`);
// })

router.get("/add-product", (req, res, next) => {
  res.sendFile(path.join(__dirname, "./../", "views", "add-product.html"));
});

router.post("/add-product", (req, res, next) => {
  console.log(req.body);
  res.redirect("/");
});

module.exports = router;
