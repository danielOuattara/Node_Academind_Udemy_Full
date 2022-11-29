const mongodb = require("mongodb");
const { getDb } = require("../util/database");

class Product {
  constructor(title, price, description, imageUrl, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    return db.collection("products").insertOne(this);
  }

  static fetchAll() {
    const db = getDb();
    return db.collection("products").find({}).toArray();
  }

  static fetchUserProducts(id) {
    const db = getDb();
    return db.collection("products").find({ userId: id }).toArray();
  }

  static findById(id) {
    const db = getDb();
    return db
      .collection("products")
      .find({ _id: new mongodb.ObjectId(id) })
      .next();
  }

  static updateProduct(id, obj) {
    const db = getDb();
    return db
      .collection("products")
      .updateOne({ _id: new mongodb.ObjectId(id) }, { $set: obj });
  }

  static deleteById(id) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: new mongodb.ObjectId(id) });
  }
}

module.exports = Product;
