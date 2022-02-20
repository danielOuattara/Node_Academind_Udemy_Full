const mongodb = require('mongodb');
const getDb = require('./../util/database').getDb;


class User {
  constructor(username, email, cart, id ) {
    this.name = username;
    this.email = email;
    this.cart = cart;  // { items: []}
    this._id = id; // needed for comparison
  }

  //----------------------------------------------------------------
  save() {
    const db = getDb();
    return db.collection('users').insertOne(this);
  }

  //----------------------------------------------------------------
  static findById(userId) { 
    const db = getDb();
    return db.collection('users').findOne({_id: new mongodb.ObjectId(userId)});
  }
  
  //----------------------------------------------------------------
  getCart() {
    const db = getDb();
    const productsId = this.cart.items.map( item => {
      return item.productId  // return an array of product id's
    });  

    return db.collection('products').find( { _id: {$in: productsId } }).toArray()
    .then( products => {
        return products.map(product => {
          return {
            ...product, 
            quantity: this.cart.items.find( item => item.productId.toString() === product._id.toString()).quantity
          }
        })
      })
    .catch(err => console.log(err))
  }
  
  //----------------------------------------------------------------
  addToCart(product) {

    let updatedQuantity = 1
    const db = getDb();
    
    if(!this.cart || !this.cart.items) {  // new user & new cart OR old user & empty cart.items
      let newCartItem = { 
        items: [ {productId: new mongodb.ObjectId(product._id), quantity: updatedQuantity}]
      };
      return db.collection('users').updateOne ( 
        { _id: new mongodb.ObjectId(this._id) }, 
        { $set: { cart: newCartItem } }
      );
    }

    else {  // some product exist in cart: so let's check them
      let updatedCartItems = [...this.cart.items];     
      const productIndexInCart = this.cart.items.findIndex(item => { 
        return item.productId.toString() === product._id.toString()  // check if prodcut._id exist in cart.items
      })

      if(productIndexInCart > -1 ) { // product is already present in the cart: just increase its quantity
        updatedQuantity = this.cart.items[productIndexInCart].quantity + 1;
        updatedCartItems[productIndexInCart].quantity = updatedQuantity;

      } else { // completly new product
        updatedCartItems.push({productId: new mongodb.ObjectId(product._id), quantity: updatedQuantity})
      }

      return db.collection('users').updateOne ( 
        { _id: new mongodb.ObjectId(this._id) }, 
        { $set: { cart: { items: updatedCartItems} } }
      );
    }
  }

  //----------------------------------------------------------------
  deleteCartItem(productId) {
    const remainingCartItems = this.cart.items.filter( item => {
      return item.productId.toString() !== productId.toString();
    })

    const db = getDb();
    return db.collection('users').updateOne ( 
      { _id: new mongodb.ObjectId(this._id) }, 
      { $set: { cart: { items: remainingCartItems } } }
    );
  }

  
//-----------------------------------------------------------------
  // getOrders() {  // TO FINISH
  //   const db = getDb();
  //   let orders = [];
  //   return db.collection('orders').find({userId : this._id}).toArray()
  //     .then( ordersArray => {
  //       ordersArray.map( orderElement => {
  //         let order = {};
  //         order['id'] = orderElement._id  // OK
  //         orders.push(order)
  //         let products = []; 
  //         orderElement.items.map( item => {
  //           order.products = products;
  //           return db.collection('products').find({_id: item.productId}).next()
  //           .then( article => {
  //             let product = {};
  //             product.title = article.title;
  //             product.quantity = item.quantity
  //             product.price = article.price
  //             // console.log("product --- ==", product, '\n\n\n')            
  //             products.push(product)  
  //           })
  //           .catch(err => console.log(err))
  //         })
  //       })
  //     })
  //     .then(() => {
  //       console.log(" ******* orders ", orders)
  //       return orders
  //     })
  //       .catch(err => console.log(err))
  //     }

//-----------------------------------------------------------------


//-----------------------------------------------------------------
  // addOrder() {  // Mine !
  //   const db = getDb();
  //   return db.collection('orders').insertOne({userId: this._id, ...this.cart})
  //   .then( () => {
  //     return db.collection('users').updateOne (  // and updated it in the user
  //       { _id: new mongodb.ObjectId(this._id) }, 
  //       { $set: { cart: { items:[] } } }
  //     );
  //   })
  // }



//-----------------------------------------------------------------------

getOrders() {  // from Maximilian
  const db = getDb();
  return db.collection('orders').find({'user._id': this._id}).toArray()
}

//-----------------------------------------------------------------
  addOrder() {  // from Maximilian
    const db = getDb();
    return this.getCart()
      .then( products => {
        const order = {
          items: products,
          user: {
            _id: this._id,
            name: this.name
          }
        };
        return db.collection('orders').insertOne(order)
      })
      .then( () => {
        return db.collection('users').updateOne (  // and updated it in the user
          { _id: new mongodb.ObjectId(this._id) }, 
          { $set: { cart: { items:[] } } }
        );
      })
  }

}
module.exports = User
