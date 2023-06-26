var mongoose = require('mongoose');

var addressSchema = new mongoose.Schema({
  phone : {
    type: String,
    required: true,
  },
  zipCode : {
    type: Number,
    required: true,
  },
  "Flat/House/OfficeNo" : {
    type: String,
    required: true,
  },
  "Area/village/Street" : {
    type: String,
    required: true,
  },
  "Town/City" : {
    type: String,
    required: true,
  },
  State : {
    type: String,
    required: true,
  },
  Landmark : String,
  instructions : String
}, { timestamps: true });

module.exports = mongoose.model('Address', addressSchema);