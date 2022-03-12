const { check } = require('express-validator/check');


exports.validateInquiry = [
    check('subject', 'Subject character must be greater than 10')
        .isLength({ min: 10 }),
    check('message', 'Message must be longer than 20 characters')
        .isLength({ min: 20 })
]