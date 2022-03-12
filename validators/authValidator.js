const { check } = require('express-validator/check');


exports.validateSignup = [
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


exports.validateLogin = [
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

]