const { check } = require('express-validator/check');


exports.validateNews = [
    check('title', 'Please enter a title with characters greater than 20')
        .not().isEmpty().withMessage("Title is required!")
        .isLength({ min: 20 }),
    check('content', 'Please enter a title with characters greater than 100')
        .not().isEmpty().withMessage("Content is required!")
        .isLength({ min: 100 }),

]

exports.validateVotes = [
    check('title', 'Please enter a title with characters greater than 20')
        .not().isEmpty().withMessage("Title is required!")
        .isLength({ min: 20 }),
    check('choice1')
        .not().isEmpty().withMessage("Please enter a choice 1 with more than 20 characters")
        .isLength({ min: 20 }),
    check('choice2')
        .not().isEmpty().withMessage("Please enter a choice 2 with more than 20 characters")
        .isLength({ min: 20 }),
    check('choice3')
        .not().isEmpty().withMessage("Please enter a choice 3 with more than 20 characters")
        .isLength({ min: 20 }),
    check('description')
        .not().isEmpty().withMessage("Please enter a description with more than 70 characters")
        .isLength({ min: 70 }),
]


exports.validateServices = [
    check('title', 'Please enter a title with characters greater than 5')
        .not().isEmpty().withMessage("Title is required!")
        .isLength({ min: 5 }),
    check('image')
        .not().isEmpty().withMessage("Image is required"),
    check('location')
        .not().isEmpty().withMessage("Location is required")
        .isLength({ min: 5 }).withMessage('Please enter a location with more than 5 characters'),
    check('description')
        .not().isEmpty().withMessage("Description is required")
        .isLength({ min: 20 }).withMessage('Please enter a description with more than 20 characters'),

]