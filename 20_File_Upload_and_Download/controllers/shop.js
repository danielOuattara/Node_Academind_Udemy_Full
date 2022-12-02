const Product = require("./../models/product");
const Order = require("./../models/order");
const fs = require("fs");
const path = require("path");

const PDFDocument = require("pdfkit");

//---------------------------------------------------------------
exports.getProducts = (req, res, next) => {
  Product.find({})
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httStatusCode = 500;
      return next(error);
    });
};

//---------------------------------------------------------------
exports.getIndex = (req, res, next) => {
  Product.find({})
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        // isAuthenticated: req.session.isLoggedIn,  /* Replaced by app.js 53-55 */
        // csrfToken: req.csrf()
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httStatusCode = 500;
      return next(error);
    });
};

//-------------------------------------------------------------------
exports.getProduct = (req, res, next) => {
  Product.findById(req.params.productId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httStatusCode = 500;
      return next(error);
    });
};

//---------------------------------------------------------------
exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      // console.log(user)
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: user.cart.items,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httStatusCode = 500;
      return next(error);
    });
};

//---------------------------------------------------------------
exports.postCart = (req, res, next) => {
  Product.findById(req.body.productId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httStatusCode = 500;
      return next(error);
    });
};

// //---------------------------------------------------------------
exports.postCartDeleteProduct = (req, res, next) => {
  req.user
    .deleteItemFromCart(req.body.productId)
    .then((user) => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: user.cart.items,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httStatusCode = 500;
      return next(error);
    });
};

//---------------------------------------------------------------

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((item) => {
        return {
          quantity: item.quantity,
          product: { ...item.productId },
        };
      });
      const orders = new Order({
        user: {
          email: req.user.email,
          userId: req.user._id,
        },
        products,
      });
      return orders.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httStatusCode = 500;
      return next(error);
    });
};

//---------------------------------------------------------------
exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httStatusCode = 500;
      return next(error);
    });
};

//---------------------------------------------------------------

// /* basic solution; not interseting for memory optimization: see next
//-------------------------*/
// exports.getInvoice = (req, res, next) => {
//   Order.findById(req.params.orderId)
//     .then((order) => {
//       if (!order) {
//         return next(new Error("Order Not Found"));
//       }
//       if (req.user._id.toString() !== order.user.userId.toString()) {
//         return next(new Error("Not Authorized ! "));
//       }

//       const invoiceName = "invoice_" + req.params.orderId + ".pdf";
//       const invoicePath = path.join("data", "invoices", invoiceName);
//       fs.readFile(invoicePath, (err, data) => {
//         if (err) {
//           console.log(err);
//           return next(err);
//         }
//         res.setHeader("Content-Type", "Application/pdf");
//         res.setHeader(
//           "Content-Disposition",
//           "attachment; filename=" + invoiceName,
//         );
//         res.send(data);
//       });
//     })
//     .catch((error) => next(error));
// };

/* getInvoice: Stream file data
--------------------------------*/
// exports.getInvoice = (req, res, next) => {
//   Order.findById(req.params.orderId)
//     .then((order) => {
//       if (!order) {
//         return next(new Error("Order Not Found"));
//       }
//       if (req.user._id.toString() !== order.user.userId.toString()) {
//         return next(new Error("Not Authorized ! "));
//       }

//       const invoiceName = "invoice_" + req.params.orderId + ".pdf";
//       const invoicePath = path.join("data", "invoices", invoiceName);
//       const file = fs.createReadStream(invoicePath);
//       res.setHeader("Content-Type", "Application/pdf");
//       res.setHeader(
//         "Content-Disposition",
//         "attachment; filename=" + invoiceName,
//       );
//       file.pipe(res);
//     })
//     .catch((error) => next(error));
// };

/* getInvoice: generate pdf file
---------------------------------*/
exports.getInvoice = (req, res, next) => {
  Order.findById(req.params.orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("Order Not Found"));
      }
      if (req.user._id.toString() !== order.user.userId.toString()) {
        return next(new Error("Not Authorized ! "));
      }

      const invoiceName = "invoice_" + req.params.orderId + ".pdf";
      const invoicePath = path.join("data", "invoices", invoiceName);

      const pdfDoc = new PDFDocument();
      res.setHeader("Content-Type", "Application/pdf");
      res.setHeader("Content-Disposition", "inline; filename=" + invoiceName);
      const file = fs.createWriteStream(invoicePath);
      pdfDoc.pipe(file);
      pdfDoc.pipe(res);

      pdfDoc.fontSize(18).text(`Invoice ${req.params.orderId}\n\n`, {
        underline: true,
      });

      pdfDoc.fontSize(12).text(`Date:  ${new Date()}\n`);
      pdfDoc.fontSize(12).text(`Client-email : ${order.user.email} \n\n`);

      pdfDoc
        .fontSize(13)
        .text(`Item:       Quantity     -       Price(Roubles)`);

      let totalPrice = 0;
      order.products.forEach((item) => {
        totalPrice += item.product.price * item.quantity;
        pdfDoc.text(
          `${item.product.title}:         ${item.quantity} x      ${item.product.price} Roubles  `,
        );
      });

      pdfDoc.text(`\n _____________________ \n`);

      pdfDoc.fontSize(16).text(`Total price : ${totalPrice} Roubles`);
      pdfDoc.end();
    })
    .catch((error) => next(error));
};
