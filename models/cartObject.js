var mongoose = require('mongoose');

var cartObjectSchema = new mongoose.Schema({
  name : {
    type: String,
    required: true,
  },
  quantity : {
    type: Number,
    required: true,
  },
  price : {
    type: Number ,
    required: true,
  },
  product : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  buyer : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Buyer'
  },
  seller : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller'
  },
});

cartObjectSchema.pre('save', async function(next) {
  next();
});

cartObjectSchema.post('save', async function(doc, next) {
  console.log('CartObject saved');
});

module.exports = mongoose.model('CartObject', cartObjectSchema);