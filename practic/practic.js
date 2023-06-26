const mongoose = require('mongoose')
const OrderObject = require('../models/orderObjects.js')

let con = mongoose.connect("mongodb+srv://rayvivek881:12345@shoppingcartcluster.yhhg1jf.mongodb.net/", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB.....'))
    .catch(err => console.log(err));


const Order = require('../models/order.js')
async function answer() {
  
  mongoose.disconnect();
}

answer();