const Product = require("./../../models/product");

const getProducts = (req, res, next) => {
  Product.find({ userId: req.session.user._id })
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httStatusCode = 500;
      return next(error);
    });
};

module.exports = getProducts;
