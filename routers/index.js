const router = require('express').Router();

const authRouter = require('./auth.js');
const buyerRouter = require('./buyer.js');
const sellerRouter = require('./seller.js');
const orderRouter = require('./order.js');


router.use('/auth', authRouter);
router.use('/buyer', buyerRouter);
router.use('/seller', sellerRouter);
router.use('/order', orderRouter);

module.exports = router;