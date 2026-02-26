const Review = require('../../database/models/review.model');
const Order = require('../../database/models/order.model');
const { BadRequestError, NotFoundError, UnauthorizedError } = require('../../shared/utils/ApiError');
const { paginate } = require('../../shared/utils/pagination');

const hasPurchasedBook = async (userId, bookId) => {
  const order = await Order.findOne({
    user_id: userId,
    order_status: 'delivered',
    'books.book_id': bookId
  });
  return !!order;
};

const addReview = async (userId, { book_id, rating, comment }) => {
  const purchased = await hasPurchasedBook(userId, book_id);
  if (!purchased) {
    throw new BadRequestError('You can only review books you have purchased and received');
  }

  const existingReview = await Review.findOne({ user_id: userId, book_id });
  if (existingReview) {
    throw new BadRequestError('You have already reviewed this book');
  }

  const review = await Review.create({
    user_id: userId,
    book_id,
    rating,
    comment: comment || ''
  });

  return review;
};

const getReviews = async ({ book_id, page, limit }) => {
  const result = await paginate(
    Review,
    { book_id },
    {
      page,
      limit,
      sort: '-createdAt',
      populate: { path: 'user_id', select: 'firstname lastname' }
    }
  );

  const { avgRating, count } = await Review.getAverageRating(book_id);

  return {
    ...result,
    avgRating: Math.round(avgRating * 10) / 10,
    totalReviews: count
  };
};

const deleteReview = async (reviewId, userId) => {
  const review = await Review.findById(reviewId);
  if (!review) throw new NotFoundError('Review not found');

  if (review.user_id.toString() !== userId.toString()) {
    throw new UnauthorizedError('You can only delete your own reviews');
  }

  await review.deleteOne();
  return { message: 'Review deleted successfully' };
};

module.exports = {
  addReview,
  getReviews,
  deleteReview
};