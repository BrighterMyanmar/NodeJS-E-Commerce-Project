const router = require('express').Router();
const controller = require('../controllers/childcat');
const { saveSingleFile } = require('../utils/gallery');


router.post('/', saveSingleFile, controller.add)
router.get('/', controller.all)

router.route('/:id')
   .get(controller.get)
   .patch(saveSingleFile, controller.patch)
   .delete(controller.drop)

module.exports = router;