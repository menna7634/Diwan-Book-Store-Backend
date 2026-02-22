const express = require('express');
const router = express.Router();
const controller = require('./cart.controller');
const {
  GetCartValidator,
  AddItemValidator,
  SetQuantityValidator,
  ChangeStepValidator,
  BookIdParamValidator,
} = require('./cart.validation');
//const { authenticate } = require('../../middleware/auth');

//router.use(authenticate);

router.get('/', GetCartValidator(), controller.getCart);
router.post('/items', AddItemValidator(), controller.addItem);
router.patch(
  '/items/:bookId',
  BookIdParamValidator(),
  SetQuantityValidator(),
  controller.setQuantity
);
router.patch(
  '/items/:bookId/increase',
  BookIdParamValidator(),
  ChangeStepValidator(),
  controller.increaseQuantity
);
router.patch(
  '/items/:bookId/decrease',
  BookIdParamValidator(),
  ChangeStepValidator(),
  controller.decreaseQuantity
);
router.delete('/items/:bookId', BookIdParamValidator(), controller.removeItem);
router.delete('/', controller.clearCart);

module.exports = router;
