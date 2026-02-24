const Cart = require('../../database/models/cart.model');
const {
  NotFoundError,
  BadRequestError,
} = require('../../shared/utils/ApiError');

const MAX_QTY = 99;

//get or create cart for user
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user_id: userId });
  if (!cart) cart = await Cart.create({ user_id: userId, items: [] });
  return cart;
};

//find item index in cart
const findItemIndex = (cart, bookId) =>
  cart.items.findIndex((i) => i.book_id.toString() === bookId.toString());

const getCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  return cart;
};

const addItem = async (userId, { bookId, quantity, price }) => {
  const cart = await getOrCreateCart(userId);
  const idx = findItemIndex(cart, bookId);

  if (idx !== -1) {
    const newQty = cart.items[idx].quantity + quantity;
    if (newQty > MAX_QTY)
      throw new BadRequestError(`Quantity cannot exceed ${MAX_QTY}`);
    cart.items[idx].quantity = newQty;
  } else {
    cart.items.push({ book_id: bookId, quantity, price });
  }

  await cart.save();
  return cart;
};

const setQuantity = async (userId, bookId, quantity) => {
  const cart = await getOrCreateCart(userId);
  const idx = findItemIndex(cart, bookId);
  if (idx === -1) throw new NotFoundError('Item not found in cart');

  cart.items[idx].quantity = quantity;
  await cart.save();
  return cart;
};

const increaseQuantity = async (userId, bookId, step = 1) => {
  const cart = await getOrCreateCart(userId);
  const idx = findItemIndex(cart, bookId);
  if (idx === -1) throw new NotFoundError('Item not found in cart');

  const newQty = cart.items[idx].quantity + step;
  if (newQty > MAX_QTY)
    throw new BadRequestError(`Quantity cannot exceed ${MAX_QTY}`);
  cart.items[idx].quantity = newQty;

  await cart.save();
  return cart;
};

const decreaseQuantity = async (userId, bookId, step = 1) => {
  const cart = await getOrCreateCart(userId);
  const idx = findItemIndex(cart, bookId);
  if (idx === -1) throw new NotFoundError('Item not found in cart');

  const newQty = cart.items[idx].quantity - step;
  if (newQty < 1) {
    // Remove item if qty would drop below 1
    cart.items.splice(idx, 1);
  } else {
    cart.items[idx].quantity = newQty;
  }

  await cart.save();
  return cart;
};

const removeItem = async (userId, bookId) => {
  const cart = await getOrCreateCart(userId);
  const idx = findItemIndex(cart, bookId);
  if (idx === -1) throw new NotFoundError('Item not found in cart');

  cart.items.splice(idx, 1);
  await cart.save();
  return cart;
};

const clearCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  cart.items = [];
  await cart.save();
  return cart;
};

module.exports = {
  getCart,
  addItem,
  setQuantity,
  increaseQuantity,
  decreaseQuantity,
  removeItem,
  clearCart,
};
