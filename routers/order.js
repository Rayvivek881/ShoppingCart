const router = require('express').Router();
const AuthToken = require('../middlewares/authToken.js')

const { CreateOrder, GetOrders, UpdateOrder }  = require('../controllers/order.js');

router.route('/createorder').post(AuthToken, CreateOrder);
router.route('/orders').get(AuthToken, GetOrders);
router.route('/orders/:orderId').put(AuthToken, UpdateOrder);

module.exports = router;