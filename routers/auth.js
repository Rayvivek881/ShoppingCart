const router = require('express').Router();

const buyerAuthRouter = require('./auth/buyer');
const sellerAuthRouter = require('./auth/seller');


router.use('/buyer', buyerAuthRouter);
router.use('/seller', sellerAuthRouter);

module.exports = router;