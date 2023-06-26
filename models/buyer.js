var mongoose = require('mongoose');

var buyerSchema = new mongoose.Schema({
  userId : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  addresses : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address'
  }],
  cart : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CartObject'
  }],
  orders : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Buyer', buyerSchema);