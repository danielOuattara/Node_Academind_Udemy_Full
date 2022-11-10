const Product = require("../models/product");
const Cart = require("./../models/cart");
//--------------------------------------------------------

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err.message));
};

//--------------------------------------------------------

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

//--------------------------------------------------------

exports.getProduct = (req, res, next) => {
  Product.findByPk(req.params.productId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

//--------------------------------------------------------

exports.getCart = (req, res, next) => {
  let totalAmount;
  req.user
    .getCart()
    .then((cart) => {
      totalAmount = cart.amount;
      return cart.getProducts();
    })
    .then((products) => {
      products.forEach((product) =>
        console.log(product.price, product.cartItem.quantity)
      );
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        cartData: { products, totalAmount },
      });
    })
    .catch((err) => console.log(err));
};

//--------------------------------------------------------

exports.postCart = (req, res, next) => {
  let fetchedCart;
  let updatedQuantity = 1;
  let updatedAmount = 0;

  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      updatedAmount = cart.amount;
      return cart.getProducts({ where: { id: req.body.productId } });
    })
    .then((products) => {
      let product;
      if (products.length === 1) {
        // product exits in cart, so increase its quantity
        product = products[0];
        updatedQuantity = product.cartItem.quantity + 1;
        return product;
      } else {
        return Product.findByPk(req.body.productId);
      }
    })
    .then((product) => {
      updatedAmount += product.price;
      return fetchedCart.addProduct(product, {
        through: { quantity: updatedQuantity },
      });
    })
    .then(() => {
      return fetchedCart.update({ amount: updatedAmount });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

//--------------------------------------------------------

exports.postCartDeleteProduct = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: req.body.productId } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(() => res.redirect("/cart"))
    .catch((err) => console.log(err.message));
};

//--------------------------------------------------------

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      // console.log("products = ", products);
      return req.user
        .createOrder() // create an empty order for the user
        .then((order) => {
          console.log("order = ", order);
          return order.addProducts(
            products.map((product) => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch((err) => console.log(err));
    })
    .then(() => {
      return fetchedCart.setProducts(null); // cleaning the cart
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

//---------------------------------------------------------------

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: "products" })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};

//---------------------------------------------------------------

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
