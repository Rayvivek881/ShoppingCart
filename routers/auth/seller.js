const router = require('express').Router();
const AuthToken = require('../../middlewares/authToken.js')
const {
  registerSeller, loginSeller, forgetPassword, resetPassword, getSellerProfile, updateSellerProfile
} = require('../../controllers/auth/seller.js');


router.route('/register').post(registerSeller);
router.route('/login').post(loginSeller);
router.route('/forget-password/:email').get(forgetPassword);
router.route('/reset-password/:token').put(resetPassword);
router.route('/profile').put(AuthToken, updateSellerProfile);
router.route('/profile').get(AuthToken, getSellerProfile);

module.exports = router;