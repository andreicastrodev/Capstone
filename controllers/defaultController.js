
exports.getIndex = (req, res, next) => {
    res.render('default/index', {
        pageTitle: 'Group 4',
        path: '/'
    })
}