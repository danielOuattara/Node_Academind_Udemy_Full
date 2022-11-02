const express = require("express");
const router = express.Router();

router.get("/add-product", (req, res, next) => {
  res.send(`
        <form action='/admin/product' method='POST'>
            <label for="title"> Enter a Book title : </label>
            <input type='text' name='title'/>
            <button type='submit'>Send</button>
        </form>`);
});

router.post("/product", (req, res, next) => {
  // new !
  console.log(req.body);
  res.redirect("/");
});

module.exports = router;
