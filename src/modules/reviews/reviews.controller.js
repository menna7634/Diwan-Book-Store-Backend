const catchAsync = require('../../shared/utils/catchAsync');
const reviewService = require('./reviews.service');

const addReview = catchAsync(async (req, res) => {
  const review = await reviewService.addReview(req.user._id, req.body);
  res.status(201).json({
    status: 'success',
    message: 'Review added successfully',
    data: { review }
  });
});

const getReviews = catchAsync(async (req, res) => {
  const result = await reviewService.getReviews(req.query);
  res.status(200).json({
    status: 'success',
    data: result
  });
});

const deleteReview = catchAsync(async (req, res) => {
  const result = await reviewService.deleteReview(req.params.id, req.user._id);
  res.status(200).json({
    status: 'success',
    message: result.message
  });
});

module.exports = {
  addReview,
  getReviews,
  deleteReview
};