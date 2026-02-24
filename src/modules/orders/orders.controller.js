const catchAsync = require('../../shared/utils/catchAsync');
const orderService = require('./orders.service');

const placeOrder = catchAsync(async (req, res) => {
  const order = await orderService.placeOrder(req.user._id, req.body);
  res.status(201).json({ status: 'success', data: { order } });
});

const getMyOrders = catchAsync(async (req, res) => {
  const result = await orderService.getMyOrders(req.user._id, req.query);
  res.json({ status: 'success', ...result });
});

const getOrderById = catchAsync(async (req, res) => {
  const isAdmin = req.user.role === 'admin';
  const order = await orderService.getOrderById(
    req.params.orderId,
    req.user._id,
    isAdmin
  );
  res.json({ status: 'success', data: { order } });
});

const getAllOrders = catchAsync(async (req, res) => {
  const result = await orderService.getAllOrders(req.query);
  res.json({ status: 'success', ...result });
});

const updateOrderStatus = catchAsync(async (req, res) => {
  const order = await orderService.updateOrderStatus(
    req.params.orderId,
    req.body
  );
  res.json({ status: 'success', data: { order } });
});

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
