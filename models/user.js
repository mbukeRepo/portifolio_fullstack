const { ObjectId }  = require('mongodb');
const getDb = require('../util/database').getDb;

class User {
  constructor(name,email,id,cart){
    this.name = name;
    this.email = email;
    this._id = id;
    this.cart= cart;
  }
  save(){
    const db = getDb();
    return db.collection('users').insertOne(this);
  }
  addToCart(product){
    // get index of product in the cart
    const cartItemIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1; 
    const updatedCartItems = [...this.cart.items];
    // increment quantity
    if(cartItemIndex >= 0){
      newQuantity = updatedCartItems[cartItemIndex].quantity +1;
      updatedCartItems[cartItemIndex].quantity = newQuantity; 
    }else{
      // create new item 
      updatedCartItems.push({productId:product._id,quantity:newQuantity});
    }
    
    const db = getDb();
    const updatedCart = { items:updatedCartItems };
    return db.collection('users').updateOne({_id: new ObjectId(this._id)},{ $set:{cart:updatedCart}});
  }
  getCart(){
    const db = getDb();
    const productIds = this.cart.items.map(i => i.productId);
    return db.collection('products').find({_id:{$in:productIds}}).toArray()
    .then(products => {
      return products.map(p => {
        return {
          ...p,
          quantity : this.cart.items.find(i => i.productId.toString() === p._id.toString()).quantity
        }
      });
    })
    .catch(err => console.log(err));
  }
  deleteProductsFromCart(prodId){
    const updatedCartItems = this.cart.items.filter( i => {
      return i.productId.toString() !== prodId.toString();
    });
    const db = getDb();
    return db.collection('users').updateOne({_id: new ObjectId(this._id)},{ $set:{cart:{items: updatedCartItems}}});

  }
  addOrder(){
    const db = getDb();
    return this.getCart()
    .then(products => {
      const order = {
        items:products,
        user:{
          name:this.name,
          _id: new ObjectId(this._id),
          email: this.email
        }
      }
      return db.collection('orders').insertOne(order);
    })
    .then(() => {
      this.cart = { items: [] };
      return db.collection('users').updateOne({_id: new ObjectId(this._id)},{ $set:{cart:{items: []}}});
    })
    .catch(err => console.log(err));
  }
  getOrders(){
    const db = getDb();
    return db.collection('orders').find({'user._id': new ObjectId(this._id)})
    .toArray();
  }
  static findById(id){
    const db = getDb();
    return db.collection('users').find({ _id: new ObjectId(id) })
    .next()
    .then(product => {
      return product;
    })
    .catch(err => console.log(err));
  }
}

module.exports = User;
