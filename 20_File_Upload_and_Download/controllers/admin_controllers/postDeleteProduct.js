const Product = require("../../models/product");
const deleteFile = require("../../util/file");

//---------------------------------------------------------------
const postDeleteProduct = (req, res, next) => {
  Product.findById(req.body.productId)
    .then((product) => {
      if (!product) {
        return next(new Error("Product Not Found"));
      }
      deleteFile(product.imageUrl);
      return Product.findOneAndDelete({
        _id: req.body.productId,
        userId: req.user._id,
      });
    })
    .then(() => res.redirect("/admin/products"))
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httStatusCode = 500;
      return next(error);
    });
};

module.exports = postDeleteProduct;
