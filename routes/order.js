const router = require('express').Router();
const controller = require('../controllers/order');
const { validateToken } = require('../utils/validator');


router.post('/', validateToken(), controller.add)
router.get('/my', validateToken(),controller.getMyOrders)

// router.route('/:id')
//     .get(controller.get)
//     .patch(controller.patch)
//     .delete(controller.drop)

module.exports = router;