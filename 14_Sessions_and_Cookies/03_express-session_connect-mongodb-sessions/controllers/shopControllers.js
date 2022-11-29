const Product = require("../models/productModel");
const Order = require("../models/orderModel");

//---------------------------------------------------------------
exports.getProducts = (req, res) => {
  Product.find({})
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

//---------------------------------------------------------------
exports.getIndex = (req, res) => {
  Product.find({})
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

//-------------------------------------------------------------------
exports.getProduct = (req, res) => {
  Product.findById(req.params.productId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

//---------------------------------------------------------------
exports.getCart = (req, res) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      console.log("user = ", user);
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: user.cart.items,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

//---------------------------------------------------------------
exports.postCart = (req, res) => {
  Product.findById(req.body.productId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

// //---------------------------------------------------------------
exports.postCartDeleteProduct = (req, res) => {
  req.user
    .deleteItemFromCart(req.body.productId)
    .then((user) => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: user.cart.items,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

//---------------------------------------------------------------

exports.postOrder = (req, res) => {
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
          name: req.user.name,
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
    .catch((err) => console.log(err));
};

//---------------------------------------------------------------
exports.getOrders = (req, res) => {
  Order.find({ "user.userId": req.user.id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};
