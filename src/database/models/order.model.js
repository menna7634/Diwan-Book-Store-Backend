const mongoose = require('mongoose');
const { isInteger, isPositiveMoney } = require('../../shared/utils/validators');

//Sub schemas
const orderItemSchema = new mongoose.Schema(
  {
    book_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'Book is required'],
    },
    name: { type: String, required: [true, 'Book name snapshot is required'] },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
      validate: isInteger,
    },
    price: {
      type: Number,
      required: [true, 'Price snapshot is required'],
      validate: isPositiveMoney,
    },
  },
  { _id: false }
);

const historySchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    changedAt: { type: Date, default: Date.now },
    note: {
      type: String,
      maxlength: [500, 'Note cannot exceed 500 characters'],
    },
  },
  { _id: false }
);

const shippingSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    phone: { type: String, trim: true },
    street: {
      type: String,
      required: [true, 'Street is required'],
      trim: true,
    },
    city: { type: String, required: [true, 'City is required'], trim: true },
    state: { type: String, trim: true },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
  },
  { _id: false }
);
// the main schema
const orderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Order name is required'],
      trim: true,
      maxlength: [200, 'Order name too long'],
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    payment_method: {
      type: String,
      required: [true, 'Payment method is required'],
      enum: {
        values: ['card', 'cash_on_delivery', 'paypal'],
        message: '{VALUE} is not a valid payment method',
      },
    },
    payment_status: {
      type: String,
      enum: {
        values: ['pending', 'paid', 'failed', 'refunded'],
        message: '{VALUE} is not a valid payment status',
      },
      default: 'pending',
    },
    order_status: {
      type: String,
      enum: {
        values: ['placed', 'processing', 'shipped', 'delivered', 'cancelled'],
        message: '{VALUE} is not a valid order status',
      },
      default: 'placed',
    },
    order_history: { type: [historySchema], default: [] },
    shipping_details: {
      type: shippingSchema,
      required: [true, 'Shipping details are required'],
    },
    books: {
      type: [orderItemSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'Order must have at least one book',
      },
    },
    total_price: { type: Number },
    time_delivered: { type: Date },
  },
  { timestamps: true }
);

//indexes
orderSchema.index({ user_id: 1, createdAt: -1 });
orderSchema.index({ order_status: 1 });
orderSchema.index({ payment_status: 1 });
orderSchema.index({ createdAt: -1 });

orderSchema.pre('save', function (next) {
  this.total_price = this.books.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (this.isModified('order_status')) {
    this.order_history.push({ status: this.order_status });
    if (this.order_status === 'delivered') this.time_delivered = new Date();
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
