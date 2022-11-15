const mongodb = require("mongodb");
const { getDb } = require("../util/database");

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart; // { items: []}
    this._id = id; // needed for comparison
  }

  //----------------------------------------------------------------
  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  //----------------------------------------------------------------
  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new mongodb.ObjectId(userId) });
  }

  //----------------------------------------------------------------
  static findAllUsers() {
    const db = getDb();
    return db.collection("users").find().toArray();
  }

  //----------------------------------------------------------------
  getCart() {
    const db = getDb();
    const productsId = this.cart.items.map((item) => {
      return item.productId; // return an array of product id's
    });

    return db
      .collection("products")
      .find({ _id: { $in: productsId } })
      .toArray()
      .then((products) => {
        return products.map((product) => {
          return {
            ...product,
            quantity: this.cart.items.find(
              (item) => item.productId.toString() === product._id.toString()
            ).quantity,
          };
        });
      })
      .catch((err) => console.log(err));
  }

  //----------------------------------------------------------------
  addToCart(product) {
    let updatedQuantity = 1;
    const db = getDb();

    if (!this.cart || !this.cart.items) {
      // new user & new cart OR old user & empty cart.items
      let newCartItem = {
        items: [
          {
            productId: new mongodb.ObjectId(product._id),
            quantity: updatedQuantity,
          },
        ],
      };
      return db
        .collection("users")
        .updateOne(
          { _id: new mongodb.ObjectId(this._id) },
          { $set: { cart: newCartItem } }
        );
    } else {
      // some product exist in cart: so let's check them
      const productIndexInCart = this.cart.items.findIndex((item) => {
        return item.productId.toString() === product._id.toString(); // check if prodcut._id exist in cart.items
      });
      let updatedCartItems = [...this.cart.items];

      if (productIndexInCart > -1) {
        // product is already present in the cart: just increase its quantity
        updatedQuantity = this.cart.items[productIndexInCart].quantity + 1;
        updatedCartItems[productIndexInCart].quantity = updatedQuantity;
      } else {
        // completly new product
        updatedCartItems.push({
          productId: new mongodb.ObjectId(product._id),
          quantity: updatedQuantity,
        });
      }

      return db
        .collection("users")
        .updateOne(
          { _id: new mongodb.ObjectId(this._id) },
          { $set: { cart: { items: updatedCartItems } } }
        );
    }
  }

  //----------------------------------------------------------------
  deleteCartItem(productId) {
    const remainingCartItems = this.cart.items.filter((item) => {
      return item.productId.toString() !== productId.toString();
    });

    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: { items: remainingCartItems } } }
      );
  }

  //-----------------------------------------------------------------
  addOrder() {
    // Mine !
    const db = getDb();
    return db
      .collection("orders")
      .insertOne({ userId: this._id, ...this.cart })
      .then(() => {
        return db.collection("users").updateOne(
          // and updated it in the user
          { _id: new mongodb.ObjectId(this._id) },
          { $set: { cart: { items: [] } } }
        );
      });
  }
  //-----------------------------------------------------------------------
  getOrders() {
    const db = getDb();
    return db.collection("orders").find({ "user._id": this._id }).toArray();
  }

  //-----------------------------------------------------------------
  addOrder() {
    const db = getDb();
    return this.getCart()
      .then((products) => {
        const order = {
          items: products,
          user: {
            _id: this._id,
            name: this.name,
          },
        };
        return db.collection("orders").insertOne(order);
      })
      .then(() => {
        return db.collection("users").updateOne(
          // and updated it in the user
          { _id: new mongodb.ObjectId(this._id) },
          { $set: { cart: { items: [] } } }
        );
      });
  }
}
module.exports = User;
