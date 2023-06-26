const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const Buyer = require('../../models/buyer');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

/**
 * @route   POST /api/auth/buyer/register
 * @return JSON Web Token
 */

exports.registerBuyer = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email }).select({ _id: 1 });
    if (user == null) {
      user = (await User.create([{
        name, email,
        password: await bcrypt.hash(password, 10),
      }], { session })).shift();
    }
    let buyer = await Buyer.findOne({ userId: user._id }).select({ _id: 1 });
    if (buyer != null) {
      return res.status(400).json({
        msg: 'Buyer already exists with given email'
      });
    }
    console.log("good job..." , user);
    await Buyer.create([{ userId: user._id }], { session });
    await session.commitTransaction();
    return res.status(201).json({ msg: "User Created" });
  } catch (err) {
    await session.abortTransaction();
    return res.status(500).json({ msg: 'Internal Server Error' });
  } finally {
    await session.endSession();
  }
};

/**
 * @route   POST /api/auth/buyer/login
 * @return JSON Web Token
 */

exports.loginBuyer = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (user == null) {
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
    const buyer = await Buyer.findOne({ userId: user._id }).select({ _id: 1 });
    if (buyer == null) {
      return res.status(400).json({
        msg: 'Buyer not exist with given email'
      });
    }
    const token = jwt.sign({ userId: user._id, buyerId: buyer._id }, 
      process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
};

/**
 * @route   GET /api/auth/buyer/forget-password/:email
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
};

/**
 * @route   POST /api/auth/buyer/reset-password/:token
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
};

/**
 * @route   GET /api/auth/buyer/profile
 * @return buser profile
 */

exports.getBuyerProfile = async (req, res) => {
  try {
    const { buyerId } = req.user;
    const buyer = await Buyer.findById(buyerId).populate('userId');
    if (buyer == null) {
      return res.status(400).json({
        msg: 'Buyer does not exist with given email'
      });
    }
    return res.status(200).json({ buyer });
  } catch (err) {
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
}

/**
 * @route   PUT /api/auth/buyer/profile
 * @return buser profile
 */

exports.updateBuyerProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    await User.findByIdAndUpdate(userId, {
      $set: req.body
    });
    return res.status(200).json({ message: "Profile Updated" });
  } catch (err) {
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
};