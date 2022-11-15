const Product = require("./../models/productModel");

//---------------------------------------------------------------
exports.getProducts = (req, res, next) => {
  Product.fetchUserProducts(req.user._id)
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
exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

//---------------------------------------------------------------
exports.postAddProduct = (req, res, next) => {
  Product.create({ ...req.body, userId: req.user._id })
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
  Product.updateProduct(req.body.productId, req.body)
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
};

//---------------------------------------------------------------
exports.postDeleteProduct = (req, res, next) => {
  Product.deleteById(req.body.productId)
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
};
