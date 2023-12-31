const Buyer = require('../models/buyer');
const CartObject = require('../models/cartObject');
const Seller = require('../models/seller.js')
const Address = require('../models/address.js')
const OrderObject = require('../models/orderObjects.js')
const Order = require('../models/order.js')
const mongoose = require('mongoose')

/**
 * @route   POST /api/order/cart
 * @Return Orders
 */

exports.CreateOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { buyerId } = req.user;
    let { addressId, addressObj } = req.body;
    if (addressId == null)
      addressId = (await Address.create([addressObj], { session })).shift()._id;
    let cartObjects = await CartObject.find({ buyer: buyerId }), Arr = [];
    let orderObjects = [], temp = [], valueDate = Date.now() + 7 * 24 * 60 * 60 * 1000;
    let OrderIds = [], totalPrice = 0;
    for (let i = 0; i < cartObjects.length; i += 1) {
      const { name, seller, price, quantity, product, buyer } = cartObjects[i];
      const orderObject = new OrderObject({
        name, seller, price, 
        quantity, product, buyer,
      }, { session });
      orderObjects.push(orderObject.save());
      OrderIds.push(orderObject._id);
      totalPrice += Number(price) * Number(quantity);
      temp.push(CartObject.findByIdAndDelete(cartObjects[i]._id, { session }));
      temp.push(Seller.findByIdAndUpdate(seller, { $push: { orders: orderObject._id } }, { session }));
    }
    let order = (await Order.create([{
      buyer: buyerId,
      address: addressId,
      orderObjects: OrderIds,
      total : totalPrice,
      deadline : Date.now() + valueDate,
      status : 'Pending',
    }], { session })).shift();
    await Buyer.updateOne({ _id: buyerId }, { 
      $set: { cart: [] },
      $push: { orders: order._id },
      $addToSet : { addresses: addressId },
    }, { new: true, session });
    await Promise.all(temp.concat(Arr).concat(orderObjects));
    await session.commitTransaction();
    return res.status(200).json({ order });
  } catch (err) {
    await session.abortTransaction();
    return res.status(500).json({ msg: 'Internal Server Error' });
  } finally {
    session.endSession();
  }
}

/**
 * @route   GET /api/order/cart
 * @Return Orders
 */

exports.GetOrders = async (req, res) => {
  try {
    const { buyerId } = req.user, { status } = req.query;
    let filter = { buyer: buyerId };
    if (status != null) filter.status = status;
    const orders = await Order.find(filter).populate('orderObjects address');
    return res.status(200).json({ orders });
  } catch (err) {
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
};

/**
 * @route   PUT /api/order/update/:orderId
 * @Return Orders
 */

exports.UpdateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    await Order.findByIdAndUpdate(orderId, { $set: req.body });
  } catch (err) {
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
};
