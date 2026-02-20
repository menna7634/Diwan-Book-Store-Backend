const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    book_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'Book is required'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      validate: {
        validator: Number.isInteger,
        message: 'Rating must be a whole number (1-5)',
      },
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [500, 'Comment cannot exceed 500 characters'],
    },
  },
  { timestamps: true }
);

//indexes
reviewSchema.index({ user_id: 1, book_id: 1 }, { unique: true }); // one review per user per book

//Static
reviewSchema.statics.getAverageRating = function (bookId) {
  return this.aggregate([
    { $match: { book_id: bookId } },
    {
      $group: {
        _id: '$book_id',
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]).then((r) => r[0] ?? { avgRating: 0, count: 0 });
};

module.exports = mongoose.model('Review', reviewSchema);
