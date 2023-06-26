const router = require('express').Router();
const AuthToken = require('../middlewares/authToken.js')

const {
  addToCart, categoryProduct, removeFromCart, searchProduct, updateCart, viewCart, viewProduct
} = require('../controllers/buyer.js');

router.route('/viewProduct/:productId').get(viewProduct);
router.route('/product/search').get(searchProduct);
router.route('/product/category').get(categoryProduct);
router.route('/product/addToCart').post(AuthToken, addToCart);
router.route('/product/removeFromCart/:cartObjectId').delete(AuthToken, removeFromCart);
router.route('/product/updateCart/:cartObjectId').put(AuthToken, updateCart);
router.route('/product/viewCart').get(AuthToken, viewCart);

module.exports = router;