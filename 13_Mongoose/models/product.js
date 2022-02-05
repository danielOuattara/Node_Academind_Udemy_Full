
const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    title:  {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
});


module.exports =  mongoose.model('Product', productSchema);





// const mongodb = require('mongodb')
// const getDb = require('./../util/database').getDb;

// class Product {
//   constructor(title, price, description, imageUrl, userId) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this.userId = userId;
//   }

//   save() {
//     const db = getDb();
//     return db.collection('products').insertOne(this);
//   }
  
//   static fetchAll() {
//     const db = getDb();
//     return db.collection('products').find({}).toArray();
//   }

//   static findById(id) {
//     const db = getDb();
//     return db.collection('products').find({_id: new mongodb.ObjectId(id)}).next();
//   }

//   static updateProduct(id, obj) {
//     const db = getDb();
//     return db.collection('products').updateOne({_id: new mongodb.ObjectId(id)}, {$set: obj});
//   }

//   static deleteById(id) {
//     const db = getDb();
//     return db.collection('products').deleteOne({_id: new mongodb.ObjectId(id)});
//   }

// }

// module.exports = Product;