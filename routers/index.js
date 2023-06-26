const router = require('express').Router();

const authRouter = require('./auth.js');
const buyerRouter = require('./buyer.js');
const sellerRouter = require('./seller.js');  


router.use('/auth', authRouter);
router.use('/buyer', buyerRouter);
router.use('/seller', sellerRouter);

module.exports = router;