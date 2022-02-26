const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController');

router.get('/login', authController.getLogin);
router.get('/sign-up', authController.getSignup);
router.post('/sign-up', authController.postSignup);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);
// router.get('/services/:serviceId', defaultController.getServicesDetail);

module.exports = router;