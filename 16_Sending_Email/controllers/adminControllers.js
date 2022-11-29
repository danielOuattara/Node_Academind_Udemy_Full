const Product = require("../models/productModel");

//---------------------------------------------------------------
exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

//---------------------------------------------------------------
exports.postAddProduct = (req, res, next) => {
  const product = new Product({ ...req.body, userId: req.user._id });
  product
    .save()
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
};

//---------------------------------------------------------------
exports.getEditProduct = (req, res, next) => {
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
        product: product,
      });
    })
    .catch((err) => console.log(err));
};

//---------------------------------------------------------------
exports.postEditProduct = (req, res, next) => {
  Product.findOneAndUpdate(
    { _id: req.body.productId, userId: req.user._id },
    req.body,
  )
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
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
    .catch((err) => console.log(err));
};
