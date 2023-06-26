const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const Seller = require('../../models/seller');

/**
 * @route   POST /api/auth/seller/register
 * @return JSON Web Token
 */

exports.registerSeller = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email }).select({ _id: 1 });
    if (user == null) {
      user = await User.create({
        name, email,
        password: await bcrypt.hash(password, 10),
      });
    }
    let seller = await Seller.findOne({ userId: user._id }).select({ _id: 1 });
    if (seller != null) {
      return res.status(400).json({
        msg: 'Seller already exists with given email'
      });
    }
    await Seller.create({ userId: user._id });
    return res.status(201).json({ msg: "Seller Created" });
  } catch (err) {
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
};

/**
 * @route   POST /api/auth/seller/login
 * @return JSON Web Token
 */

exports.loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (user != null) {
      return res.status(400).json({
        msg: 'User not exist with given email'
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        msg: 'Invalid Credentials'
      });
    }
    const seller = await Seller.findOne({ userId: user._id }).select({ _id: 1 });
    if (seller == null) {
      return res.status(400).json({
        msg: 'Seller not exist with given email'
      });
    }
    const token = jwt.sign({ userId: user._id, sellerId: seller._id }, 
      process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
}

/**
 * @route   GET /api/auth/seller/forget-password/:email
 * @return JSON Web Token
 */

exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (user == null) {
      return res.status(400).json({
        msg: 'Buyer does not exist with given email'
      });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_PASSWORD_RESET, {
      expiresIn: '10m'
    });
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
}

/**
 * @route   PUT /api/auth/seller/reset-password/:token
 * @return JSON Web Token
 */

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params, { password } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_PASSWORD_RESET);
    const user = await User.findById(decoded.userId);
    if (user == null) {
      return res.status(400).json({
        msg: 'Buyer does not exist with given email'
      });
    }
    user.password = await bcrypt.hash(password, 10);
    await user.save();
    return res.status(200).json({ message: "Password Updated" });
  } catch (err) {
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
}

/**
 * @route   GET /api/auth/seller/profile
 * @return seller profile
 */

exports.getSellerProfile = async (req, res) => {
  try {
    const { sellerId } = req.user;
    const seller = await Seller.findById(sellerId).populate('userId');
    if (seller == null) {
      return res.status(400).json({
        msg: 'Seller does not exist'
      });
    }
    return res.status(200).json({ seller });
  } catch (err) {
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
}

/**
 * @route   PUT /api/auth/seller/profile
 * @return seller profile
 */

exports.updateSellerProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    await User.findByIdAndUpdate(userId, {
      $set: req.body
    });
    return res.status(200).json({ message: "Profile Updated" });
  } catch (err) {
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
}