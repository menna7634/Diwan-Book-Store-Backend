const express = require('express');
const router = express.Router();
const controller = require('./orders.controller');
const {
  PlaceOrderValidator,
  GetOrdersValidator,
  OrderIdParamValidator,
  UpdateOrderStatusValidator,
} = require('./orders.validation');
const {
  IsAuthenticated,
  IsAdmin,
} = require('../../shared/middleware/auth.middleware');

router.use(IsAuthenticated());

// user routes
router.post('/', PlaceOrderValidator(), controller.placeOrder);
router.get('/my', GetOrdersValidator(), controller.getMyOrders);
router.get('/:orderId', OrderIdParamValidator(), controller.getOrderById);

// admin only routes
router.get('/', GetOrdersValidator(), IsAdmin(), controller.getAllOrders);

router.patch(
  '/:orderId',
  OrderIdParamValidator(),
  UpdateOrderStatusValidator(),
  IsAdmin(),
  controller.updateOrderStatus
);

module.exports = router;
