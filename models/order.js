var mongoose = require('mongoose');

var orderSchema = new mongoose.Schema({
  buyer : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Buyer'
  },
  orderObjects : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrderObject'
  }],
  address : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address'
  },
  total : {
    type: Number,
    required: true,
  },
  deadline : {
    type: Date,
    required: true,
  },
  status : {
    type: String,
    required: true,
  },
  trackArray : {
    type: [ String ],
    default: [],
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);