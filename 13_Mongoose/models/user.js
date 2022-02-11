const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }]
    },
});

userSchema.methods.addToCart = function (product) {
    const productIndexInCart = this.cart.items.findIndex(item => { // check if product already in cart
        return item.productId.valueOf() === product._id.valueOf();
    })
    let newQuantity = 1;
    // let updatedCart;
    let updatedCartItems = [...this.cart.items];
    if(productIndexInCart >= 0) { // product does exist in card
        newQuantity = this.cart.items[productIndexInCart].quantity + 1;
        updatedCartItems[productIndexInCart].quantity = newQuantity 

        //------------------------------------------------------------------------------
        // updatedCart = { //TODO : pourquoi ça ne fonctionne pas comme avec Redux ? ...modify state with immutability
        //     ...this.cart,
        //     items: [
        //         ...this.cart.items,
        //         {
        //          ...this.cart.items[productIndexInCart],
        //           quantity: this.cart.items[productIndexInCart].quantity + 1
        //         }
        //     ]
        // }
        //-------------------------------------------------------------------------------

    // console.log("cartUpdated ====>",  updatedCartItems) // OK !

    } else {
        this.cart.items.push({
            productId: product._id,
            quantity: newQuantity
        })
    }
    return this.save();
}


// userSchema.methods.getCart =  async function () {
//     const products = [...this.cart.items]
//     return products;
// }



userSchema.methods.deleteItemFromCart = function (productId) {
    console.log("Hello________")
    const updatedCartItems = this.cart.items.filter( item => {
        return item.productId.valueOf() !== productId.valueOf()
    })
    return this.save()

}



module.exports = mongoose.model('User', userSchema);

