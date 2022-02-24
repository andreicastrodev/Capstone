const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')

router.get('/dashboard', adminController.getIndex);
router.get('/create-service', adminController.getCreateService);
router.get('/manage-service', adminController.getManageService);
router.get('/edit-service/:serviceId', adminController.getEditService);
router.get('/manage-inquiry', adminController.getManageInquiry);
router.post('/create-service', adminController.postCreateService);
router.post('/edit-service', adminController.postEditService);
router.post('/delete-service', adminController.postDeleteService);
router.post('/delete-inquiry', adminController.postDeleteInquiry);
module.exports = router;