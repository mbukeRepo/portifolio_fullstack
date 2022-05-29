const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;


const url = 'mongodb://127.0.0.1:27017';
let _db ;

const mongoConnect = (cb) => {
  mongoClient.connect(url)
  .then((client) => {
    _db = client.db('shop');
    console.log('connected !!');
    cb();
  })
  .catch(err => console.log(err));
}
const getDb = () => {
  if(_db){
    return _db;
  }
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
