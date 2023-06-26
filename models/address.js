var mongoose = require('mongoose');

var addressSchema = new mongoose.Schema({
  phone : {
    type: String,
    required: [true, 'User phone number required'],
    validate : {
      validator : function(num) {
        return /\d{10}/.test(num);
      },
      message : props => `${props.value} is not a valid phone number!`,
    }
  },
  zipCode : {
    type: Number,
    required: true,
    validate : {
      validator : function(num) {
        return /\d{6}/.test(num);
      },
    }
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