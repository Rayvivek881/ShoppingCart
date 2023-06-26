var mongoose = require('mongoose');

var sellerSchema = new mongoose.Schema({
  userId : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  orders : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrderObject'
  }],
  products : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
}, { timestamps: true });

module.exports = mongoose.model('Seller', sellerSchema);