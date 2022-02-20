const Product = require('../models/product');


//--------------------------------------------------------
exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => console.log(err.message));
};

//--------------------------------------------------------
exports.getProducts = (req, res, next) => {
  Product.findAll()
  .then(products =>{
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  })
  .catch(err => console.log(err));
};

//--------------------------------------------------------
// exports.getProduct = (req, res, next) => {  // OK !
//   //Product.findOne({where: {id : req.params.productId}})
//   Product.findByPk(req.params.productId)
//   .then((product => {
  //     res.render('shop/product-detail', {
    //       product,
    //       pageTitle: product.title,
    //       path: '/products'
    //     });
    //   }))
    //   .catch(err => console.log(err))
    // };
    
//--------------------------------------------------------
exports.getProduct = (req, res, next) => {
  Product.findAll({where: {id: req.params.productId}})
  .then(products => {
    res.render('shop/product-detail', {
      product: products[0],
      pageTitle: products[0].title,
      path: '/products'
    });
  })
  .catch(err => console.log(err))
};


//--------------------------------------------------------
exports.getCart = (req, res, next) => {
  req.user.getCart()
    .then(cart => {
      console.log("cart ====> ",cart)
      return cart.getProducts()
    })
    .then( products => {
      console.log(products)
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products,
      })
    })
    .catch(err => console.log(err))
  };
  
//--------------------------------------------------------

// exports.postCart = (req, res, next) => { // OK  method 1
//   let fetchedCart;
//   let newQuantity = 1;
//   req.user.getCart()
//     .then(cart => {
//       fetchedCart = cart;
//       return cart.getProducts({where: {id: req.body.productId}})
//     })
//     .then(products => {
//       let product;
      
//       if(products.length > 0) {  // product exits in cart, so increase its quantity
//         product = products[0];  
//         newQuantity = product.cartItem.quantity + 1;
//         return fetchedCart.addProduct(product, {through: {quantity: newQuantity} })  // method 1
//       }
//       return Product.findByPk(req.body.productId)
//         .then((product) => {
//           return fetchedCart.addProduct(product, { through: { quantity: newQuantity} })
//         })
//         .catch(err => console.log(err))
//     })
//     .then(() => res.redirect('/cart'))
//     .catch(err => console.log(err))
// };

exports.postCart = (req, res, next) => {  // method 2
  let fetchedCart;
  let newQuantity = 1;
  req.user.getCart()
    .then( cart => {
      fetchedCart = cart;
      return cart.getProducts({where: {id: req.body.productId}})
    })
    .then( products => {
      let product;
      if(products.length > 0) {  // product exits in cart, so increase its quantity
        product = products[0];  
        newQuantity = product.cartItem.quantity + 1;
        return product;  // method 2
      }
      return Product.findByPk(req.body.productId)
    })
    .then( product => { // method 2
      return fetchedCart.addProduct(product, { through: { quantity: newQuantity} })
    })
    .then(() => res.redirect('/cart'))
    .catch(err => console.log(err))
};



//--------------------------------------------------------
// exports.postCart = (req, res, next) => {
//   let fetchedCart;
//   let newQuantity = 1;
//   req.user.getCart()
//     .then(cart => {
//       fetchedCart = cart;
//       return cart.getProducts({where: {id: req.body.productId}})
//     })
//     .then(products => {
//       let product;
      
//       if(products.length > 0) {
//         product = products[0];
//       }

//       if(product) {  // product exits in cart, so increase its quantity 
//         newQuantity = product.cartItem.quantity + 1;
//         return fetchedCart.addProduct(product, {through: {quantity: newQuantity} })  // merhod 1
//         // return product;  // method 2
//       }
//       return Product.findByPk(req.body.productId)
//         .then((product) => {
//           return fetchedCart.addProduct(product, { through: { quantity: newQuantity} })
//         })
//         .catch(err => console.log(err))
//   })
//     // .then(product => { // method 2
//     //   return fetchedCart.addProduct(product, { through: { quantity: newQuantity} })
//     // })
//     .then(() => res.redirect('/cart'))
//     .catch(err => console.log(err))
// };

//--------------------------------------------------------
exports.postCartDeleteProduct = (req, res, next) => {
  req.user.getCart()
    .then(cart => {
      return cart.getProducts({where: {id: req.body.productId} });
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(() =>res.redirect('/cart'))
    .catch(err => console.log(err.message))
};

//--------------------------------------------------------
exports.postOrder = (req, res, next)=> {
  let fetchedCart;
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return req.user.createOrder()
      .then(order => {
        return order.addProducts(products.map(product => {
          product.orderItem = {quantiy: product.cartItem.quantity}
          return product;
        }))
      })
      .catch(err => console.log(err))
    })
    .then(() => {
      return fetchedCart.setProducts(null) // cleaning the cart
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err))
}

//--------------------------------------------------------
exports.getOrders = (req, res, next) => {
  req.user.getOrders({include: ['products']})
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders:orders,
      });
    })
    .catch(err => console.log(err))
};

//--------------------------------------------------------
exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
