const mongoose = require('mongoose');
const {
  isPositiveMoney,
  isInteger,
  URL_REGEX,
} = require('../../shared/utils/validators');
const bookSchema = new mongoose.Schema(
  {
    author_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Author',
      required: [true, 'Author is required'],
    },
    categories: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'At least one category is required',
      },
    },
    book_title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
      minlength: [1, 'Book title cannot be empty'],
      maxlength: [300, 'Book title cannot exceed 300 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    book_cover_url: {
      type: String,
      trim: true,
      match: [URL_REGEX, 'Cover URL must be a valid http/https URL'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0.01, 'Price must be greater than 0'],
      max: [999999.99, 'Price is too high'],
      validate: isPositiveMoney,
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative'],
      validate: isInteger,
    },
  },
  { timestamps: true }
);
//indexes
bookSchema.index({ author_id: 1 });
bookSchema.index({ book_title: 'text' });
bookSchema.index({ categories: 1 });
bookSchema.index({ price: 1 });
bookSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Book', bookSchema);
