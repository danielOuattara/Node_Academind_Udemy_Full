const Product = require("./../models/product");
const { validationResult } = require("express-validator");
const deleteFile = require("./../util/file");
//---------------------------------------------------------------

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: null,
    validationsErrorsArray: [],
  });
};

//---------------------------------------------------------------
exports.postAddProduct = (req, res, next) => {
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
        // image: req.file,
        price: req.body.price,
        description: req.body.description,
      },
      errorMessage: errors.array()[0].msg,
      validationsErrorsArray: errors.array(),
    });
  }

  if (!req.file) {
    Product.findOneAndUpdate(
      { _id: req.body.productId, userId: req.user._id },
      req.body,
    )
      .then(() => res.redirect("/admin/products"))
      .catch((err) => {
        const error = new Error(err);
        error.httStatusCode = 500;
        return next(error);
      });
  } else if (req.file) {
    Product.findById(req.body.productId)
      .then((product) => {
        if (!product) {
          return next(new Error("Product Not Found"));
        }
        deleteFile(product.imageUrl);
        return product.updateOne({ ...req.body, imageUrl: req.file.path });
      })

      .then(() => res.redirect("/admin/products"))
      .catch((err) => {
        const error = new Error(err);
        error.httStatusCode = 500;
        return next(error);
      });
  }
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
    .catch((err) => {
      const error = new Error(err);
      error.httStatusCode = 500;
      return next(error);
    });
};

// //---------------------------------------------------------------
// exports.postDeleteProduct = (req, res, next) => {
//   Product.findById({ _id: req.body.productId, userId: req.user._id })
//     .then((product) => {
//       if (!product) {
//         return next(new Error("Product Not Found"));
//       }
//       deleteFile(product.imageUrl);
//       return Product.findOneAndDelete({
//         _id: req.body.productId,
//         userId: req.user._id,
//       });
//     })
//     .then(() => res.redirect("/admin/products"))
//     .catch((err) => {
//       const error = new Error(err);
//       error.httStatusCode = 500;
//       return next(error);
//     });
// };

//---------------------------------------------------------------
// --> Asynchronous Requests on Javascript

exports.deleteProduct = (req, res, next) => {
  Product.findById({ _id: req.params.productId, userId: req.user._id })
    .then((product) => {
      if (!product) {
        return next(new Error("Product Not Found"));
      }
      deleteFile(product.imageUrl);
      return product.delete();
    })
    .then(() => res.status(201).json({ message: "Success" }))
    .catch((err) => {
      res.status(500).json(err.message);
    });
};
