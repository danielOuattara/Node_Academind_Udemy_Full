const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
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
  resetPasswordToken: String,
  resetPasswordTokenExpiration: Date,
});

//------------------------------------------------------------------------------------
userSchema.methods.addToCart = function (product) {
  const productIndexInCart = this.cart.items.findIndex((item) => {
    // check if product already in cart
    return item.productId.valueOf() === product._id.valueOf();
  });
  let updatedCartItems = [...this.cart.items];

  if (productIndexInCart >= 0) {
    // product does exist in card
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

module.exports = mongoose.model("User", userSchema);
