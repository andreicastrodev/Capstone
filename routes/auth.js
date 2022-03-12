const express = require('express')
const router = express.Router()
const { check } = require('express-validator/check');
const authController = require('../controllers/authController');
const validators = require('../validators/authValidator');
const User = require('../models/user');
router.get('/login', authController.getLogin);
router.get('/sign-up', authController.getSignup);
router.get('/admin/login', authController.getAdminLogin);
router.get('/admin/sign-up', authController.getAdminSignup);
router.post('/sign-up', validators.validateSignup, authController.postSignup);
router.post('/login', validators.validateLogin, authController.postLogin);
router.post('/logout', authController.postLogout);
router.post('/admin/sign-up', authController.postAdminSignup);
router.post('/admin/login', authController.postAdminLogin);
router.post('/admin/logout', authController.postAdminLogout);

module.exports = router;