const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

//------------------------------------------------------------------------------------
userSchema.methods.addToCart = function (product) {
  // check if product already in cart
  const productIndexInCart = this.cart.items.findIndex((item) => {
    return item.productId.valueOf() === product._id.valueOf();
  });
  let updatedCartItems = [...this.cart.items];

  // product does exist in card
  if (productIndexInCart >= 0) {
    updatedCartItems[productIndexInCart].quantity++;
  } else {
    // add a new product in cart
    updatedCartItems.push({
      productId: product._id,
      quantity: 1,
    });
  }
  this.cart = { items: updatedCartItems };
  return this.save();
};

//------------------------------------------------------------------------------------
userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

//----------------------------------------------------------------------------------
userSchema.methods.deleteItemFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter((item) => {
    return item.productId.valueOf() !== productId.valueOf();
  });
  this.cart = { items: updatedCartItems };
  return this.save();
};

//----------------------------------------------------------------------------------
// userSchema.methods.getOrders = function () {
//     return db.collection('orders').find({'user._id': this._id}).toArray()
// }

module.exports = mongoose.model("User", userSchema);
