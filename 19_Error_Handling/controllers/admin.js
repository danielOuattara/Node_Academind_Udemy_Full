const Product = require("./../models/product");
const { validationResult } = require("express-validator");

//---------------------------------------------------------------
exports.getAddProduct = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: message,
    product: {
      title: "",
      imageUrl: "",
      price: "",
      description: "",
    },
    validationsErrorsArray: [],
  });
};

//---------------------------------------------------------------
exports.postAddProduct = (req, res, next) => {
  /* validations are made in the previous middleware 
  (prodcutValidate, see admin routes) but the results of 
  that validations are handled just below, before 
  the login controller logic 
  */

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Admin Product",
      path: "/admin/edit-product",
      editing: false,
      hasError: true,
      product: {
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        description: req.body.description,
      },
      errorMessage: errors.array()[0].msg,
      validationsErrorsArray: errors.array(),
    });
  }

  const product = new Product({ ...req.body, userId: req.user._id });
  product
    .save()
    .then(() => res.redirect("/admin/products"))
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
};

//---------------------------------------------------------------
exports.getEditProduct = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  Product.findById(req.params.productId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        hasError: false,
        product: product,
        errorMessage: message,
        product,
        validationsErrorsArray: [],
      });
    })
    .catch((err) => console.log(err));
};

//---------------------------------------------------------------
exports.postEditProduct = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      path: "/admin/edit-product",
      pageTitle: "Admin Product",
      hasError: true,
      editing: true,
      userInputs: {
        email: req.body.email,
      },
      product: {
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        description: req.body.description,
      },
      errorMessage: errors.array()[0].msg,
      validationsErrorsArray: errors.array(),
    });
  }

  Product.findOneAndUpdate(
    { _id: req.body.productId, userId: req.user._id },
    req.body
  )
    .then(() => res.redirect("/admin/products"))
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
};

//---------------------------------------------------------------
exports.getProducts = (req, res, next) => {
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
    .catch((err) => console.log(err));
};

//---------------------------------------------------------------
exports.postDeleteProduct = (req, res, next) => {
  Product.findOneAndDelete({ _id: req.body.productId, userId: req.user._id })
    .then(() => res.redirect("/admin/products"))
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
};
