const Product = require('./../models/product');
const Order = require('./../models/order');

//---------------------------------------------------------------
exports.getProducts = (req, res, next) => {
  console.log(req.isLoggedIn);
  Product.find({})
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        isAuthenticated: req.isLoggedIn
      });
    })
    .catch(err => {
      console.log(err);
    });
  };
  
  //---------------------------------------------------------------
  exports.getIndex = (req, res, next) => {
    Product.find({})
      .then(products => {
        res.render('shop/index', {
          prods: products,
          pageTitle: 'Shop',
          path: '/',
          isAuthenticated: req.isLoggedIn
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

//-------------------------------------------------------------------
exports.getProduct = (req, res, next) => {
  Product.findById(req.params.productId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
        isAuthenticated: req.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

//---------------------------------------------------------------
exports.getCart = (req, res, next) => {
  req.user.populate('cart.items.productId')
    .then( user => {
      console.log(user)
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: user.cart.items,
        isAuthenticated: req.isLoggedIn
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


// //---------------------------------------------------------------
exports.postCartDeleteProduct = (req, res, next) => {
  req.user.deleteItemFromCart(req.body.productId) 
    .then( user => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: user.cart.items,
        isAuthenticated: req.isLoggedIn
      });
    })
    .catch(err => console.log(err));
  };

//---------------------------------------------------------------

 exports.postOrder = (req, res ,next) => {
  
  req.user.populate('cart.items.productId')
    .then( user => {
      const products = user.cart.items.map( item => {
        return { 
          quantity: item.quantity,
          product: {...item.productId}
        }
      })
      const orders = new Order({
        user: {
          name: req.user.name,
          userId: req.user._id
        },
        products,
      });
      console.log("orders ----------->>>>>>   ", orders)
      return orders.save();
    })
    .then(() => {
      return req.user.clearCart()
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err))
}

//---------------------------------------------------------------
exports.getOrders = (req, res, next) => {
  Order.find({'user.userId': req.user._id})
    .then(orders => {
        res.render('shop/orders', {
          path: '/orders',
          pageTitle: 'Your Orders',
          orders: orders,
          isAuthenticated: req.isLoggedIn
        });
      })
      .catch(err => console.log(err))
};
  