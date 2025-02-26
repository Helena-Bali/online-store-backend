const Router = require('express')
const router = new Router()
const authMiddleware = require('../middleware/authMiddleware')
const basketController = require('../controllers/basketController')

router.post('/add', authMiddleware, basketController.addToBasket)
router.post('/remove', authMiddleware, basketController.deleteFromBasket)
router.post('/decrease', authMiddleware, basketController.decreaseQuantity)
router.post('/increase', authMiddleware, basketController.increaseQuantity)
router.get('/', authMiddleware, basketController.getBasket)
router.get('/', (req, res) => {
    res.json({ message: 'Корзина API работает' });
});

module.exports = router
