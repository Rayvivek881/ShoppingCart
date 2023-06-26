const Seller = require('../models/seller');
const Product = require('../models/product.js');
const OrderObject = require('../models/orderObjects.js');

/**
 * @route   POST /api/seller/createproduct
 * @Return Product
 */

exports.createProduct = async (req, res) => {
  try {
    const { sellerId } = req.user;
    const product = await Product.create({
      ...req.body,
      seller: sellerId
    });
    await Seller.updateOne({ _id : sellerId} , {
      $addToSet : { products : product._id }
    }, { new : true })
    return res.status(201).json({ product });
  } catch (err) {
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
};

/**
 * @route   GET /api/seller/products
 * @Return Products
 */

exports.getProducts = async (req, res) => {
  try {
    const { sellerId } = req.user;
    const products = await Product.find({ seller : sellerId });
    return res.status(200).json({ products });
  } catch (err) {
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
};

/**
 * @route   put /api/seller/products/:productId
 * @Return Product
 */

exports.updateProduct = async (req, res) => {
  try {
    const { productId } = req.params, { sellerId } = req.user;
    const product = await Product.findById(productId);
    if (product.seller != sellerId || product == null) {
      return res.status(400).json({ msg: 'Something went wrong' });
    }
    return res.status(200).json({ product });
  } catch (err) {
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
};

/**
 * @route   delete /api/seller/products/:productId
 * @Return Product
 */

exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params, { sellerId } = req.user;
    const result = await OrderObject.findOne({ product: productId, orderSend : false })
      .select({ _id: 1 });
    if (result != null || result.seller != sellerId) {
      return res.status(400).json({ msg: 'something went wrong' });
    }
    const product = await Product.findByIdAndDelete(productId);
    await Seller.updateOne({ _id : sellerId }, { 
      $pull : { products : productId }
    }, { new : true });
    return res.status(200).json({ product });
  } catch (err) {
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
}

/**
 * @route   GET /api/seller/orders
 * @Return Orders
 */

exports.getOrders = async (req, res) => {
  try {
    const { sellerId } = req.user, { orderSend } = req.query;
    let filter = { seller: sellerId };
    if (orderSend) {
      filter.orderSend = orderSend;
    }
    console.log("filter", filter);
    const orders = await OrderObject.find(filter)
      .populate('product')
    return res.status(200).json({ orders });
  } catch (err) {
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
};


/**
 * @route   PUT /api/seller/orders/:orderObjectId
 * @Return Order
 */

exports.sendOrder = async (req, res) => {
  try {
    const { orderObjectId } = req.params;
    await OrderObject.findByIdAndUpdate(orderObjectId, {
      $set : { orderSend: true }
    });
    return res.status(200).json({ msg: 'Order Send' });
  } catch {err} {
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
}
