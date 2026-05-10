// 购物车相关路由
const express = require('express');
const router = express.Router();
const cartService = require('../services/cartService');
const auth = require('../middleware/auth');

/**
 * 获取购物车
 * GET /api/cart
 */
router.get('/', auth, async (req, res, next) => {
  try {
    const userId = req.userId;
    const result = await cartService.getCart(userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * 添加到购物车
 * POST /api/cart
 */
router.post('/', auth, async (req, res, next) => {
  try {
    const userId = req.userId;
    const { productId, quantity, specId } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        code: 400,
        message: '商品ID和数量不能为空'
      });
    }

    const result = await cartService.addToCart(userId, {
      productId,
      quantity: parseInt(quantity),
      specId
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * 修改购物车商品数量
 * PUT /api/cart/:cartItemId
 */
router.put('/:cartItemId', auth, async (req, res, next) => {
  try {
    const userId = req.userId;
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    if (!quantity) {
      return res.status(400).json({
        code: 400,
        message: '数量不能为空'
      });
    }

    const result = await cartService.updateCartItemQuantity(
      userId,
      cartItemId,
      parseInt(quantity)
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * 删除购物车项
 * DELETE /api/cart/:cartItemId
 */
router.delete('/:cartItemId', auth, async (req, res, next) => {
  try {
    const userId = req.userId;
    const { cartItemId } = req.params;

    const result = await cartService.deleteCartItem(userId, cartItemId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * 清空购物车
 * DELETE /api/cart
 */
router.delete('/', auth, async (req, res, next) => {
  try {
    const userId = req.userId;
    const result = await cartService.clearCart(userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
