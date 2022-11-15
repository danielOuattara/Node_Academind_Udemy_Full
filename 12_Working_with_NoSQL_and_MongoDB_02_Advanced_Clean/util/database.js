const { MongoClient } = require("mongodb");

let _db;

//---------------------------------------------------------
const mongoConnect = (cb) => {
  MongoClient.connect(process.env.MONGO_URI)
    .then((client) => {
      _db = client.db();
      console.log("Connexion Successfull to MongoDB Atlas !");
      cb();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

//----------------------------------------------------------
const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database Found !";
};

//----------------------------------------------------------

module.exports = { getDb, mongoConnect };
