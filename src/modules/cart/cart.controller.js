const { paginateArray } = require('../../shared/utils/pagination');
const catchAsync = require('../../shared/utils/catchAsync');
const cartService = require('./cart.service');

const getCart = catchAsync(async (req, res) => {
  const cart = await cartService.getCart(req.user._id);
  const paginated = paginateArray(cart.items, req.query);

  res.json({
    status: 'success',
    data: {
      ...paginated,
      total: cart.total,
    },
  });
});

const addItem = catchAsync(async (req, res) => {
  const { bookId, quantity, price } = req.body;
  const cart = await cartService.addItem(req.user._id, {
    bookId,
    quantity,
    price,
  });
  res.status(201).json({ status: 'success', data: { cart } });
});

const setQuantity = catchAsync(async (req, res) => {
  const cart = await cartService.setQuantity(
    req.user._id,
    req.params.bookId,
    req.body.quantity
  );
  res.json({ status: 'success', data: { cart } });
});

const increaseQuantity = catchAsync(async (req, res) => {
  const cart = await cartService.increaseQuantity(
    req.user._id,
    req.params.bookId,
    req.body.step
  );
  res.json({ status: 'success', data: { cart } });
});

const decreaseQuantity = catchAsync(async (req, res) => {
  const cart = await cartService.decreaseQuantity(
    req.user._id,
    req.params.bookId,
    req.body.step
  );
  res.json({ status: 'success', data: { cart } });
});

const removeItem = catchAsync(async (req, res) => {
  const cart = await cartService.removeItem(req.user._id, req.params.bookId);
  res.json({ status: 'success', data: { cart } });
});

const clearCart = catchAsync(async (req, res) => {
  const cart = await cartService.clearCart(req.user._id);
  res.json({ status: 'success', data: { cart } });
});

module.exports = {
  getCart,
  addItem,
  setQuantity,
  increaseQuantity,
  decreaseQuantity,
  removeItem,
  clearCart,
};
