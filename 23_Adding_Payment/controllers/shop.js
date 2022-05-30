const Product = require("./../models/product");
const Order = require("./../models/order");
const fs = require("fs");
const path = require("path");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE);

const PDFDocument = require("pdfkit");

const ITEMS_PER_PAGE = 1;

//---------------------------------------------------------------
exports.getProducts = (req, res, next) => {
  let totalItems;
  let page = Number(req.query.page) || 1;

  Product.countDocuments()
    .then((number) => {
      totalItems = number;
      return Product.find({})
        .skip((req.query.page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
        totalItems,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        nextPage: page + 1,
        hasPreviousPage: page > 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        currentPage: page,
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
  let totalItems;
  let page = Number(req.query.page) || 1;
  Product.countDocuments()
    .then((number) => {
      totalItems = number;
      return Product.find({})
        .skip((req.query.page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })

    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        // isAuthenticated: req.session.isLoggedIn,  /* Replaced by app.js 53-55 */
        // csrfToken: req.csrf()
        totalItems,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        nextPage: page + 1,
        hasPreviousPage: page > 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        currentPage: page,
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

//-----------------------------------------------------------------
exports.getCheckout = (req, res, next) => {
  let products;
  let totalAmount = 0;
  req.user.populate("cart.items.productId")
    .then((user) => {
      products = user.cart.items;
      products.forEach((item) => {
        console.log(item);
        totalAmount += item.quantity * item.productId.price;
      });

      return stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: products.map((item) => {
          return {
            name: item.productId.title,
            description: item.productId.description,
            amount: item.productId.price * 100,
            currency: "eur",
            quantity: item.quantity,
          };
        }),
        success_url: `${req.protocol}://${req.get("host")}/checkout/success/`,
        cancel_url: `${req.protocol}://${req.get("host")}/checkout/cancel/`,
      });
    })

    .then((session) => {
      res.render("shop/checkout", {
        path: "/checkout",
        pageTitle: "Your Cart",
        products,
        totalAmount,
        sessionId: session.id,
        STRIPE_PUBLIC: process.env.STRIPE_PUBLIC,
      });
    })

    .catch((err) => {
      console.log(err);
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

// //---------------------------------------------------------------

// --> No more needed: using stripe

// exports.postOrder = (req, res, next) => {
//   req.user
//     .populate("cart.items.productId")
//     .then((user) => {
//       const products = user.cart.items.map((item) => {
//         return {
//           quantity: item.quantity,
//           product: { ...item.productId },
//         };
//       });
//       const orders = new Order({
//         user: {
//           email: req.user.email,
//           userId: req.user._id,
//         },
//         products,
//       });
//       return orders.save();
//     })
//     .then(() => {
//       return req.user.clearCart();
//     })
//     .then(() => {
//       res.redirect("/orders");
//     })
//     .catch((err) => {
//       const error = new Error(err);
//       error.httStatusCode = 500;
//       return next(error);
//     });
// };

//---------------------------------------------------------------
exports.getCheckoutSuccess = (req, res, next) => {
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
//           "attachment; filename=" + invoiceName
//         );
//         res.send(data);
//       });
//     })
//     .catch((error) => next(error));
// };

//---------------------------------------------------------------

// /* getInvoice: Stream file data
// --------------------------------*/
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
//         "attachment; filename=" + invoiceName
//       );
//       file.pipe(res);
//     })
//     .catch((error) => next(error));
// };

//---------------------------------------------------------------

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
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + invoiceName
      );
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(18).text(`Invoice ${req.params.orderId}\n\n`, {
        underline: true,
      });

      pdfDoc.fontSize(12).text(`Date:  ${new Date()}\n`);
      pdfDoc.fontSize(12).text(`Client-email : ${order.user.email} \n\n`);

      pdfDoc.fontSize(14).text(`Items \n`);

      let totalPrice = 0;
      order.products.forEach((item) => {
        totalPrice += item.product.price * item.quantity;
        pdfDoc.text(
          `${item.product.title}  - ${item.quantity} x ${item.product.price} Roubles  `
        );
      });

      pdfDoc.text(`\n _____________________ \n`);

      pdfDoc.fontSize(18).text(`Total price : ${totalPrice} Roubles`);
      pdfDoc.end();
    })
    .catch((error) => next(error));
};
