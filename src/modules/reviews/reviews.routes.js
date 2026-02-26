const express = require('express');
const router = express.Router();
const reviewController = require('./reviews.controller');
const {
  AddReviewValidate,
  GetReviewsValidate,
  ReviewIdParamValidate
} = require('./reviews.validation');
const { IsAuthenticated } = require('../../shared/middleware/auth.middleware');

router.get('/', GetReviewsValidate(), reviewController.getReviews);

router.post('/', IsAuthenticated(), AddReviewValidate(), reviewController.addReview);

router.delete('/:id', IsAuthenticated(), ReviewIdParamValidate(), reviewController.deleteReview);

module.exports = router;