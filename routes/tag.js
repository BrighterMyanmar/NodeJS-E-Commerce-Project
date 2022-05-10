const router = require('express').Router();
const controller = require('../controllers/tag');
const { saveSingleFile } = require('../utils/gallery');
const { validateBody } = require('../utils/validator');
const { TagSchema } = require('../utils/schema');


router.post('/', saveSingleFile, validateBody(TagSchema.add), controller.add)
router.get('/', controller.all)

router.route('/:id')
   .get(controller.get)
   .patch(saveSingleFile, controller.patch)
   .delete(controller.drop)

module.exports = router;