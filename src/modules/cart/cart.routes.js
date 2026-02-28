const express = require('express');
const router = express.Router();
const controller = require('./cart.controller');
const { IsAuthenticated } = require('../../shared/middleware/auth.middleware');
const {
  GetCartValidator,
  AddItemValidator,
  SetQuantityValidator,
  ChangeStepValidator,
  BookIdParamValidator,
} = require('./cart.validation');

router.get('/', IsAuthenticated(), GetCartValidator(), controller.getCart);
router.post(
  '/items',
  IsAuthenticated(),
  AddItemValidator(),
  controller.addItem
);
router.patch(
  '/items/:bookId',
  IsAuthenticated,
  BookIdParamValidator(),
  SetQuantityValidator(),
  controller.setQuantity
);
router.patch(
  '/items/:bookId/increase',
  IsAuthenticated(),
  BookIdParamValidator(),
  ChangeStepValidator(),
  controller.increaseQuantity
);
router.patch(
  '/items/:bookId/decrease',
  IsAuthenticated(),
  BookIdParamValidator(),
  ChangeStepValidator(),
  controller.decreaseQuantity
);
router.delete(
  '/items/:bookId',
  IsAuthenticated(),
  BookIdParamValidator(),
  controller.removeItem
);
router.delete('/', IsAuthenticated(), controller.clearCart);

module.exports = router;
