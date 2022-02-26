const User = require('../models/user')
const bcrypt = require('bcryptjs');
exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    isAuth: req.session.isLoggedIn
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/sign-up', {
    pageTitle: 'Signup',
    path: '/signup',
    isAuth: req.session.isLoggedIn
  });
};


exports.postSignup = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const mobileNumber = req.body.mobileNumber;
  const password = req.body.password;

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name,
      email,
      mobileNumber,
      password: hashedPassword
    })
    const result = await user.save();
    console.log(`user created`, result);

    return res.redirect('/login');
  } catch (error) {
    const err = new Error(error);
    err.httpStatusCode = 500;
    return next(err);
  }
}



exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;


  try {
    const user = await User.findOne({ email: email })
    if (!user) {
      return res.redirect('/login')
    }
    const doMatch = await bcrypt.compare(password, user.password);
    if (doMatch) {
      req.session.isLoggedIn = true;
      req.session.user = user;
      return req.session.save(err => {
        console.log(`Error:`, err);
        res.redirect('/')
      })
    }

  } catch (error) {
    const err = new Error(error);
    err.httpStatusCode = 500;
    return next(err);
  }

}



exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(`LOGGED OUT`, err)
    res.redirect('/')
  })
}