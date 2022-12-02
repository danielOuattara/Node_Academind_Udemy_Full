const Product = require("./../../models/product");

function getEditProduct(req, res, next) {
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
        errorMessage: null,
        product,
        validationsErrorsArray: [],
      });
    })
    .catch((err) => {
      const error = new Error(err);
      console.log(error);
      error.httStatusCode = 500;
      return next(error);
    });
}

module.exports = getEditProduct;
