var mongoose = require('mongoose');

var orderObjectSchema = new mongoose.Schema({
  name : {
    type: String,
    required: true,
  },
  quantity : {
    type: Number,
    required: true,
  },
  price : {
    type: Number,
    required: true,
  },
  orderSend : {
    type: Boolean,
    default: false,
  },
  product : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  seller : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller'
  },
}, { timestamps: true });

module.exports = mongoose.model('OrderObject', orderObjectSchema);