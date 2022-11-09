const Product = require("../models/product");

//------------------------------------------------------------
// exports.getProducts = (req, res, next) => {
//   Product.findAll()
//     .then(products => {
//       res.render('admin/products', {
//         prods: products,
//         pageTitle: 'Admin Products',
//         path: '/admin/products'
//       });
//     })
//     .catch(err => console.log(err));
// };

//----- OR

exports.getProducts = (req, res, next) => {
  // get all product from a specific user
  req.user
    .getProducts()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
};

//------------------------------------------------------------
exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

//------------------------------------------------------------
// exports.postAddProduct = (req, res, next) => {
//   Product.create(req.body)
//   .then(() => res.redirect("/"))
//   .catch(err => console.log(err))
// };

// --- OR

exports.postAddProduct = (req, res, next) => {
  req.user
    .createProduct(req.body) // User.createProduct --> method earned from association
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err));
};

//------------------------------------------------------------
// exports.getEditProduct = (req, res, next) => {
//   if (!req.query.edit) {
//     return res.redirect('/');
//   }
//   Product.findByPk(req.params.productId)
//     .then(product => {
//       if (!product) {
//         return res.redirect('/');
//       }
//       res.render('admin/edit-product', {
//         pageTitle: 'Edit Product',
//         path: '/admin/edit-product',
//         editing: req.query.edit,
//         product: product
//       });
//     })
//     .catch(err => console.log(err))
// };

// ---- OR

exports.getEditProduct = (req, res, next) => {
  if (!req.query.edit) {
    return res.redirect("/");
  }
  req.user
    .getProducts({ where: { id: req.params.productId } })
    .then((products) => {
      if (!products[0]) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: req.query.edit,
        product: products[0],
      });
    })
    .catch((err) => console.log(err));
};

//------------------------------------------------------------

// exports.postEditProduct = (req, res, next) => {  // OK
//   Product.findByPk(req.body.productId)
//   .then( product => {
//     product.update(req.body)
//     .then(() => {
//       res.redirect('/admin/products')
//     })
//   })
//   .catch(err =>console.log(err))
// };

// ----- OR

// exports.postEditProduct = (req, res, next) => {  // OK
//   Product.findByPk(req.body.productId)
//   .then( product => {
//     return product.update(req.body);
//   })
//   .then(() => {
//     res.redirect('/admin/products')
//   })
//   .catch(err =>console.log(err))
// };

// ----- OR

exports.postEditProduct = (req, res, next) => {
  Product.update(req.body, { where: { id: req.body.productId } })
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
};

//------------------------------------------------------------

exports.postDeleteProduct = (req, res, next) => {
  Product.destroy({ where: { id: req.body.productId } })
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
};
