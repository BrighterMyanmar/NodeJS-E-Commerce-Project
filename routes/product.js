const router = require('express').Router();
const controller = require('../controllers/product');
const { saveMultipleFile } = require('../utils/gallery');


router.post('/', saveMultipleFile, controller.add)
router.get('/paginate/:page', controller.paginate)
router.get('/filter/:type/:page/:id', controller.filterBy);

router.route('/:id')
   .get(controller.get)
   .patch(controller.patch)
   .delete(controller.drop)

module.exports = router;