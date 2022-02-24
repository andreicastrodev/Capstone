const express = require('express')
const router = express.Router()
const defaultController = require('../controllers/defaultController')

router.get('/', defaultController.getIndex);

router.get('/services', defaultController.getServices);
router.get('/services/:serviceId', defaultController.getServicesDetail);
router.get('/inquiry', defaultController.getInquiry);
router.get('/profile', defaultController.getProfile);
router.get('/profile/inquiry-history', defaultController.getInquiryHistory)
router.post('/inquiry', defaultController.postInquiry);
module.exports = router;