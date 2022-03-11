const express = require('express')
const router = express.Router()
const { check } = require('express-validator/check');
const authController = require('../controllers/authController');
const User = require('../models/user');
router.get('/login', authController.getLogin);
router.get('/sign-up', authController.getSignup);
router.get('/admin/login', authController.getAdminLogin);
router.get('/admin/sign-up', authController.getAdminSignup);
router.post('/sign-up', [
    check('name', 'Enter a name greater than 5 characters')
        .isLength({ min: 5 }),
    check('email')
        .isEmail()
        .withMessage('Invalid Email')
        .custom((value, { req }) => {
            return User.findOne({ email: value })
                .then(user => {
                    if (user) {
                        return Promise.reject('Email already exist');
                    }
                })
        }),
    check('password', 'Password needs to be more than 5 characters')
        .isLength({ min: 5 })
        .isAlphanumeric(),
    check('mobileNumber', 'Enter a valid mobile number')
        .isNumeric()
        .isLength({ min: 11, max: 11 }),
    check('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password does not match')
            }
            return true;
        })
]
    , authController.postSignup);
router.post('/login', [
    check('email')
        .isEmail()
        .withMessage('Email does not exist')
        .custom((value, { req }) => {
            return User.findOne({ email: value })
                .then(user => {
                    if (!user) {
                        return Promise.reject('Email Does not exist!');
                    }
                })
        }),
    
],authController.postLogin);
router.post('/logout', authController.postLogout);
router.post('/admin/sign-up', authController.postAdminSignup);
router.post('/admin/login', authController.postAdminLogin);
router.post('/admin/logout', authController.postAdminLogout);

module.exports = router;