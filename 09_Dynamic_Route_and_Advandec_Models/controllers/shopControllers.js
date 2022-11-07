const Product = require("../models/productModel");
const Cart = require("../models/cartModel");

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId, (product) => {
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  });
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const productsInCart = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cartProductData) {
          productsInCart.push({
            productData: product,
            qty: cartProductData.qty,
          });
        }
      }

      console.log("productsInCart = ", productsInCart);
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: productsInCart,
      });
    });
  });
};

// TODO
// exports.getCart = (req, res, next) => {
//   Cart.getCart((cart) => {
//     const cartProducts = [];
//     cart.products.forEach((itemInCart) => {
//       Product.findById(itemInCart.id, (productData) => {
//         cartProducts.push({ productData, qty: itemInCart.qty });
//         console.log("cartProducts = ", cartProducts);
//       });
//     });
//     console.log("cartProducts = ", cartProducts);
//     return res.render("shop/cart", {
//       path: "/cart",
//       pageTitle: "Your Cart",
//       products: cartProducts,
//     });
//   });
// };

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect("/cart");
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect("/cart");
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
