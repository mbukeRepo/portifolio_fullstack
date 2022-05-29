const mongoose = require('mongoose');
const schema = mongoose.Schema;

const orderSchema = new schema({
    userId:{
        type:schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    items:[
        {
            productId:{
                type:schema.Types.ObjectId,
                required:true,
                ref:'Product'
            },
            quantity:{
                type:Number,
                required:true
            }
        }
        ]
});


module.exports= mongoose.model('Order',orderSchema);