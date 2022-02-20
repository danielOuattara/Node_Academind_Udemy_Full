const Product = require('./../models/product');

//---------------------------------------------------------------
exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
};


//---------------------------------------------------------------
exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then( products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err);
    });
};


//---------------------------------------------------------------
exports.getProduct = (req, res, next) => {
  Product.findById(req.params.productId)
  .then(product => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    });
  })
  .catch(err => console.log(err));
};


//---------------------------------------------------------------
exports.getCart = (req, res, next) => {
  req.user.getCart()
    .then(products => {
        res.render('shop/cart', {
          path: '/cart',
          pageTitle: 'Your Cart',
          products: products
        });
      })
    .catch(err => console.log(err));
};


//---------------------------------------------------------------
exports.postCart = (req, res, next) => {
  Product.findById(req.body.productId)
  .then(product => {
    return req.user.addToCart(product)
  })
  .then(() => {
    res.redirect('/cart');
  })
  .catch(err => console.log(err));
};


//---------------------------------------------------------------
exports.postCartDeleteProduct = (req, res, next) => {
  req.user.deleteCartItem(req.body.productId)
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};


//---------------------------------------------------------------
exports.postOrder = (req, res, next) => {
  req.user.addOrder()
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
  };
  

// //---------------------------------------------------------------
exports.getOrders = (req, res, next) => {
  req.user.getOrders()
      .then(orders => {
        // console.log(" orders = ", orders)
        res.render('shop/orders', {
          path: '/orders',
          pageTitle: 'Your Orders',
          orders: orders
        });
      })
      .catch(err => console.log(err))
};
// //---------------------------------------------------------------
exports.getOrders = (req, res, next) => {
  req.user.getOrders()
      // .then( ordersArray => {
      //   let orders = [];
      //   ordersArray.map( orderElement => {
      //     let order = {};
      //     order['id'] = orderElement._id  // OK
      //     orders.push(order)
      //     let products = []; 
      //     order.products = products;
      //     orderElement.items.map( item => {
      //       let product = {};
      //       product.title = item.title;
      //       product.quantity = item.quantity;
      //       product.price = item.price
      //       products.push(product);
      //     })
      //   })
      //   return orders;
      // })
      .then(orders => {
        console.log("orders ==>  ",orders)
        res.render('shop/orders', {
          path: '/orders',
          pageTitle: 'Your Orders',
          orders: orders
        });
      })
      .catch(err => console.log(err))
};


//---------------------------------------------------------------
// exports.getOrders = (req, res, next) => {
//   let orders = req.user.getOrders()
//   console.log("received orders = ", orders)
//   res.render('shop/orders', {
//     path: '/orders',
//     pageTitle: 'Your Orders',
//     orders: orders
//   });
// };
