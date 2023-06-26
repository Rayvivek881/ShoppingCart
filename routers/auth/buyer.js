const router = require('express').Router();
const AuthToken = require('../../middlewares/authToken.js')
const {
  registerBuyer, loginBuyer, forgetPassword, resetPassword, getBuyerProfile, updateBuyerProfile
} = require('../../controllers/auth/buyer.js');


router.route('/register').post(registerBuyer);
router.route('/login').post(loginBuyer);
router.route('/forget-password/:email').get(forgetPassword);
router.route('/reset-password/:token').put(resetPassword);
router.route('/profile').get(AuthToken, getBuyerProfile);
router.route('/profile').put(AuthToken, updateBuyerProfile);

module.exports = router;