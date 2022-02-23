const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')

router.get('/dashboard', adminController.getIndex);
router.get('/create-service', adminController.getCreateService);
router.get('/manage-service', adminController.getManageService);
router.get('/edit-service/:serviceId', adminController.getEditService);
router.post('/create-service', adminController.postCreateService);
module.exports = router;