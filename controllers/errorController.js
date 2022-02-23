exports.get500 = (req, res, next) => {
    res.status(500).render('errors/500', {
      pageTitle: 'Error 505',
      path: '/500',
    });
  };
  