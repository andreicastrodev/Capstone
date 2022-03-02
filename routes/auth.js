const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController');

router.get('/login', authController.getLogin);
router.get('/sign-up', authController.getSignup);
router.get('/admin/login', authController.getAdminLogin);
router.get('/admin/sign-up', authController.getAdminSignup);
router.post('/sign-up', authController.postSignup);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);
router.post('/admin/sign-up', authController.postAdminSignup);
router.post('/admin/login', authController.postAdminLogin);
router.post('/admin/logout', authController.postAdminLogout);
// router.get('/services/:serviceId', defaultController.getServicesDetail);

module.exports = router;