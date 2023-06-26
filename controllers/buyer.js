const Buyer = require('../models/buyer');
const CartObject = require('../models/cartObject');
const Product = require('../models/product.js');
const mongoose = require('mongoose');

/**
 * @route   GET /api/buyer/viewProduct
 * @Return Product
 */

exports.viewProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    return res.status(200).json({ product });
  } catch (err) {
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
}

/**
 * @route   GET /api/buyer/product/search
 * @Return Products
 */

exports.searchProduct = async (req, res) => {
  try {
    const { search } = req.query;
    const products = await Product.find({
      $or : [ { name: { $regex: search, $options: 'i' } }, 
          { description: { $regex: search, $options: 'i' } } ]
    });
    return res.status(200).json({ products });
  } catch (err) {
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
}

/**
 * @route   GET /api/buyer/product/category
 * @Return Products
 */

exports.categoryProduct = async (req, res) => {
  try {
    const { search } = req.query;
    const products = await Product.find({ category: search });
    return res.status(200).json({ products });
  } catch (err) {
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
};

/**
 * @route   POST /api/buyer/product/addToCart
 * @Return String
 */

exports.addToCart = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { buyerId } = req.user;
    const { productId, name, seller, price } = req.body;
    const buyer = await Buyer.findById(buyerId, null, { session });
    let cartObject = await CartObject.findOne({ 
      buyer: buyerId, product: productId 
    }, null, { session });
    if (cartObject == null) {
      cartObject = new CartObject({
        quantity: 1,
        buyer: buyerId,
        product: productId,
        name, seller, price: price,
      }, { session });
    } else cartObject.quantity += 1;
    await cartObject.save({ session });
    if (!buyer.cart.includes(cartObject._id))
      buyer.cart.push(cartObject._id);
    await buyer.save({ session });
    await session.commitTransaction();
    return res.status(200).json({ msg: 'Added to Cart' });
  } catch (err) {
    await session.abortTransaction();
    return res.status(500).json({ msg: 'Internal Server Error' });
  } finally {
    session.endSession();
  }
};

/**
 * @route   DETETE /api/buyer/product/removeFromCart/:cartObjectId
 * @Return String
 */

exports.removeFromCart = async (req, res) => {
  try {
    const { buyerId } = req.user, { cartObjectId } = req.params;
    const buyer = await Buyer.findById(buyerId);
    buyer.cart.pull(cartObjectId);
    await CartObject.findByIdAndDelete(cartObjectId);
    await buyer.save();
    return res.status(200).json({ msg: 'Removed from Cart' });
  } catch (err) {
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
}


/**
 * @route   PUT /api/buyer/product/updateCart/:cartObjectId
 * @Return String
 */

exports.updateCart = async (req, res) => {
  try {
    const { cartObjectId } = req.params;
    const { quantity } = req.body;
    await CartObject.findByIdAndUpdate(cartObjectId, { $set : { quantity }});
    return res.status(200).json({ msg: 'Cart Updated' });
  } catch (err) {
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
}

/**
 * @route   GET /api/buyer/product/viewCart
 * @Return CartObjects
 */

exports.viewCart = async (req, res) => {
  try {
    const { buyerId } = req.user;
    const cartObjects = await CartObject.find({ buyer: buyerId });
    return res.status(200).json({ cartObjects });
  } catch (err) {
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
};
