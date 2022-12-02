const Product = require("./../../models/product");
const { validationResult } = require("express-validator");

const postAddProduct = (req, res, next) => {
  if (!req.file) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Admin Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: {
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
      },
      errorMessage: "Photo is missing or not valid (jpg, jpeg, png)",
      validationsErrorsArray: [],
    });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Admin Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: {
        title: req.body.title,
        image: req.file,
        price: req.body.price,
        description: req.body.description,
      },
      errorMessage: "Background Error, please try again. ",
      validationsErrorsArray: errors.array(),
    });
  }

  const product = new Product({
    ...req.body,
    imageUrl: req.file.path,
    userId: req.user._id,
  });

  product
    .save()
    .then(() => res.redirect("/admin/products"))
    .catch((err) => {
      const error = new Error(err);
      console.log(error);
      error.httStatusCode = 500;
      return next(error);
    });
};

module.exports = postAddProduct;
