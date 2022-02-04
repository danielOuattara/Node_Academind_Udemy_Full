const mongodb = require('mongodb');
const getDb = require('./../util/database').getDb;


class User {
  constructor(username, email, cart, id ) {
    this.name = username;
    this.email = email;
    this.cart = cart;  // { items: []}
    this._id = id; // needed for comparison
  }

  save() {
    const db = getDb();
    return db.collection('users').insertOne(this);
  }

  addToCart(product) {
    const productInCartIndex = this.cart.items.findIndex(cp => { // check if product already in cart
      return cp.productId === product._id
    })
    let updatedCart;
    let newQuantity = 1;
    if(productInCartIndex >= 0) { // product do exist in card
      newQuantity = this.cart.items[productInCartIndex].quantity + 1;
      updatedCart = [...this.cart.items, newQuantity]
    }
    
    updatedCart = [ ...this.cart.items, product] // { items: [{productId: new mongodb.ObjectId(product._id), quantity: newQuantity}]};   // assume no same product in cart
    // updatedCart = { items: [{productId: new mongodb.ObjectId(product._id), quantity: newQuantity}]};   // assume no same product in cart
    
    // next update user datas
      const db = getDb();
      return db.collection('users').updateOne(
        { _id: new mongodb.ObjectId(this._id) }, 
        { $set: { cart: updatedCart } }
      );
  }

  static findById(userId) { 
    const db = getDb();
    return db.collection('users').findOne({_id: new mongodb.ObjectId(userId)})
    .then( user => {
      return user
    })
    .catch(err =>console.log(err))
  }
}














module.exports = User;
