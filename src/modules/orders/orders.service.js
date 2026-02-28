const Order = require('../../database/models/order.model');
const Cart = require('../../database/models/cart.model');
const Book = require('../../database/models/book.model');
const { withTransaction } = require('../../shared/utils/transaction');
const { paginate } = require('../../shared/utils/pagination');
const {
  BadRequestError,
  NotFoundError,
} = require('../../shared/utils/ApiError');

const placeOrder = async (userId, { payment_method, shipping_details }) => {
  return withTransaction(async () => {
    try {
      const cart = await Cart.findOne({ user_id: userId });
      console.log('🔵 cart:', cart);
      if (!cart || cart.items.length === 0) {
        throw new BadRequestError('Cart is empty');
      }

      const bookIds = cart.items.map((item) => item.book_id);
      console.log('🔵 bookIds:', bookIds);
      const books = await Book.find({ _id: { $in: bookIds } });
      console.log('🔵 books found:', books.length);

      const orderBooks = [];
      for (const item of cart.items) {
        const book = books.find(
          (b) => b._id.toString() === item.book_id.toString()
        );
        console.log('🔵 matching book:', book?.book_title);
        if (!book) throw new NotFoundError(`Book ${item.book_id} not found`);

        const updated = await Book.updateOne(
          { _id: book._id, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } }
        );
        console.log('🔵 stock update:', updated.modifiedCount);
        if (updated.modifiedCount === 0) {
          throw new BadRequestError(
            `Insufficient stock for "${book.book_title}".`
          );
        }

        orderBooks.push({
          book_id: book._id,
          name: book.book_title,
          quantity: item.quantity,
          price: item.price,
        });
      }

      console.log('🔵 creating order...');
      const payment_status =
        payment_method === 'cash_on_delivery' ? 'pending' : 'paid';
      const [order] = await Order.create([
        {
          user_id: userId,
          payment_method,
          payment_status,
          shipping_details,
          books: orderBooks,
        },
      ]);
      console.log('🟢 order created:', order._id);

      cart.items = [];
      await cart.save();
      return order;
    } catch (err) {
      console.error('🔴 placeOrder error:', err.message, err.stack);
      throw err;
    }
  });
};

const getMyOrders = async (userId, query) => {
  return paginate(
    Order,
    { user_id: userId },
    {
      page: query.page,
      limit: query.limit,
      sort: '-createdAt',
      populate: { path: 'books.book_id', select: 'book_title book_cover_url' },
    }
  );
};

const getOrderById = async (orderId, userId, isAdmin) => {
  const filter = isAdmin ? { _id: orderId } : { _id: orderId, user_id: userId };

  const order = await Order.findOne(filter).populate(
    'books.book_id',
    'book_title book_cover_url'
  );

  if (!order) throw new NotFoundError('Order not found');

  return order;
};

const getAllOrders = async (query) => {
  return paginate(
    Order,
    {},
    {
      page: query.page,
      limit: query.limit,
      sort: '-createdAt',
      populate: [{ path: 'user_id' }, { path: 'books.book_id' }],
    }
  );
};

const STATUS_TRANSITIONS = {
  order: {
    placed: ['processing'],
    processing: ['shipped', 'cancelled'],
    shipped: ['delivered'],
    delivered: [],
    cancelled: [],
  },
  payment: {
    pending: ['paid', 'failed'],
    paid: ['refunded'],
    failed: [],
    refunded: [],
  },
};

const updateOrderStatus = async (
  orderId,
  { order_status, payment_status, note }
) => {
  const order = await Order.findById(orderId);
  if (!order) throw new NotFoundError('Order not found');

  if (order_status) {
    const allowed = STATUS_TRANSITIONS.order[order.order_status] || [];
    if (!allowed.includes(order_status)) {
      throw new BadRequestError(
        `Cannot transition order status from "${order.order_status}" to "${order_status}"`
      );
    }
    order.order_status = order_status;
    if (note) {
      order.order_history.push({ status: order_status, note });
    }
  }

  if (payment_status) {
    const allowed = STATUS_TRANSITIONS.payment[order.payment_status] || [];
    if (!allowed.includes(payment_status)) {
      throw new BadRequestError(
        `Cannot transition payment status from "${order.payment_status}" to "${payment_status}"`
      );
    }
    order.payment_status = payment_status;
  }

  await order.save();
  return order;
};

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
