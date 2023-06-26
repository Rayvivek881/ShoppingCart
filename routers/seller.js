const router = require('express').Router();
const AuthToken = require('../middlewares/authToken.js')

const {
  createProduct, deleteProduct, getProducts, updateProduct, getOrders, sendOrder
} = require('../controllers/seller.js');

router.route('/createproduct').post(AuthToken, createProduct);
router.route('/products').get(AuthToken, getProducts);
router.route('/products/:productId').put(AuthToken, updateProduct);
router.route('/products/:productId').delete(AuthToken, deleteProduct);
router.route('/orders').get(AuthToken, getOrders);
router.route('/orders/:orderObjectId').put(AuthToken, sendOrder);

module.exports = router;