var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
  name : {
    type: String,
    required: true,
  },
  description : {
    type: String,
    required: true,
  },
  price : {
    type: Number,
    required: true,
  },
  discount : {
    type: Number,
    default: 0,
  },
  categories : {
    type: [ String ],
    required: true,
  },
  images : {
    type: [ String ],
    default: [],
  },
  seller : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller'
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);