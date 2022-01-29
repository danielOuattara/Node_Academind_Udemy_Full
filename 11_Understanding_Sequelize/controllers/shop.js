const Product = require('../models/product');
const Cart = require('../models/cart');

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

// exports.getProduct = (req, res, next) => {
//   const prodId = req.params.productId;
//   Product.findByPk(prodId)
//   .then((product => {
//     res.render('shop/product-detail', {
//       product,
//       pageTitle: product.title,
//       path: '/products'
//     });
//   }))
//   .catch(err => console.log(err))
// };

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findOne({where: {id :prodId}})
  .then((product => {
    res.render('shop/product-detail', {
      product,
      pageTitle: product.title,
      path: '/products'
    });
  }))
  .catch(err => console.log(err))
};

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

exports.getCart = (req, res, next) => {
   req.user.getCart()
    .then(cart => {
      return cart.getProducts()
      .then( products => {
        res.render('shop/cart', {
              path: '/cart',
              pageTitle: 'Your Cart',
              products,
        })
      })
      .catch(err => console.log(err))
    })
   .catch(err => console.log(err))
};

exports.postCart = (req, res, next) => {
  req.user.getCart()
  .then(cart => {
    return cart.getProducts({where: {id: req.body.productId}})
  })
  .then(products => {
    let product;
    if(products.length > 0) {
      product = product[0];
    }
    let newQuantity = 1;
    if(product) {
      
    }
  })
  .catch(err => console.log(err))
  .then(() => res.redirect('/cart').status(201).send("Product add to chart"))
  .catch(err => console.log(err))
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId, product => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart');
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
