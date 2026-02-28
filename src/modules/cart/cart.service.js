const Cart = require('../../database/models/cart.model');
const {
  NotFoundError,
  BadRequestError,
} = require('../../shared/utils/ApiError');

const MAX_QTY = 99;

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user_id: userId }).populate(
    'items.book_id',
    'book_title book_cover_url'
  );
  if (!cart) cart = await Cart.create({ user_id: userId, items: [] });
  return cart;
};

const populateCart = (cart) =>
  cart.populate('items.book_id', 'book_title book_cover_url');

//find item index in cart
const findItemIndex = (cart, bookId) => {
  return cart.items.findIndex((item) => {
    const id = item.book_id?._id ?? item.book_id;
    return id?.toString() === bookId.toString();
  });
};
const getCart = async (userId) => {
  const cart = await getOrCreateCart(userId);

  const total = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return { cart, total };
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
  return populateCart(cart);
};

const setQuantity = async (userId, bookId, quantity) => {
  const cart = await getOrCreateCart(userId);
  const idx = findItemIndex(cart, bookId);
  if (idx === -1) throw new NotFoundError('Item not found in cart');

  cart.items[idx].quantity = quantity;
  await cart.save();
  return populateCart(cart);
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
  return populateCart(cart);
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
  return populateCart(cart);
};

const removeItem = async (userId, bookId) => {
  const cart = await getOrCreateCart(userId);
  const idx = findItemIndex(cart, bookId);
  if (idx === -1) throw new NotFoundError('Item not found in cart');

  cart.items.splice(idx, 1);
  await cart.save();
  return populateCart(cart);
};

const clearCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  cart.items = [];
  await cart.save();
  return populateCart(cart);
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
