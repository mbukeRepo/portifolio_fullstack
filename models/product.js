const mongodb= require('mongodb');
const getdb = require('../util/database').getDb;

class Product {
  constructor(title,price,description,imageUrl,id,userId){
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ?  new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }
  save(){
    const db = getdb();
    if(this._id){
      // update a product 
      return db.collection('products').updateOne({_id: this._id},{$set: this});
    }
    else{
      // create new product 
      return db.collection('products').insertOne(this);
    }
    
  }
  static fetchAll(){
    const db = getdb();
    return db.collection('products').find().toArray();
  }
  static findById(id){
    const db = getdb();
    return db.collection('products').find({ _id: new mongodb.ObjectId(id) })
    .next()
    .then(products => {
      return products;
    })
    .catch(err => console.log(err))
  }
  static deleteById(prodId) {
    const db = getdb();
    return db.collection('products').deleteOne({_id: new mongodb.ObjectId(prodId) })
    .then(() => {
      console.log('deleted...');
    })
    .catch(err => console.log(err));
  }
}

module.exports = Product;