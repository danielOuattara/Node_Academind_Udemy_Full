const Product = require("./../../models/product");
const { validationResult } = require("express-validator");
const deleteFile = require("./../../util/file");

const postEditProduct = (req, res, next) => {
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
      product: { ...req.body },
      errorMessage: errors.array()[0].msg,
      validationsErrorsArray: errors.array(),
    });
  }

  Product.findById(req.body.productId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }

      product.title = req.body.title;
      product.price = req.body.price;
      product.description = req.body.description;

      if (req.file) {
        deleteFile(product.imageUrl);
        product.imageUrl = req.file.path;
      }
      return product
        .save()
        .then(() => res.redirect("/admin/products"))
        .catch((error) => console.log(error));
    })

    .catch((err) => {
      const error = new Error(err);
      error.httStatusCode = 500;
      return next(error);
    });
};

module.exports = postEditProduct;

//------------------------------
//OK, BACKUP

// const Product = require("./../../models/product");
// const { validationResult } = require("express-validator");
// const deleteFile = require("./../../util/file");

// const postEditProduct = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(422).render("admin/edit-product", {
//       path: "/admin/edit-product",
//       pageTitle: "Admin Product",
//       hasError: true,
//       editing: true,
//       userInputs: {
//         email: req.body.email,
//       },
//       product: { ...req.body },
//       errorMessage: errors.array()[0].msg,
//       validationsErrorsArray: errors.array(),
//     });
//   }

//   if (!req.file) {
//     Product.findOneAndUpdate(
//       { _id: req.body.productId, userId: req.user._id },
//       req.body,
//     )
//       .then(() => res.redirect("/admin/products"))
//       .catch((err) => {
//         const error = new Error(err);
//         error.httStatusCode = 500;
//         return next(error);
//       });
//   } else if (req.file) {
//     Product.findById(req.body.productId)
//       .then((product) => {
//         if (!product) {
//           return next(new Error("Product Not Found"));
//         }
//         deleteFile(product.imageUrl);
//         return product.updateOne({ ...req.body, imageUrl: req.file.path });
//       })

//       .then(() => res.redirect("/admin/products"))
//       .catch((err) => {
//         const error = new Error(err);
//         error.httStatusCode = 500;
//         return next(error);
//       });
//   }
// };

// module.exports = postEditProduct;
