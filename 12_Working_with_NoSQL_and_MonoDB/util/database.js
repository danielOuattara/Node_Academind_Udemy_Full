
const MongoClient = require('mongodb').MongoClient;

let _db;

const mongoConnect = (cb) => {
  MongoClient.connect(process.env.MONGO_URI)
    .then( client => {
      console.log('Connexion Successfull to MongoDB Atlas !');
      _db = client.db();
      cb();
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
}

const getDb = () => {
  if(!_db) {
    throw 'No database Found !';
  }
  return _db;
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
// module.exports = mongoConnect;
// module.exports = getDb;
