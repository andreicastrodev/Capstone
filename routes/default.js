const express = require('express')
const router = express.Router()
const defaultController = require('../controllers/defaultController')

router.get('/', defaultController.getIndex);

router.get('/services', defaultController.getServices);
router.get('/services/:serviceId', defaultController.getServicesDetail);

module.exports = router;