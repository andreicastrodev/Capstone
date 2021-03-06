const User = require('../models/user')
const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    oldInput: {
      email: ''
    },
    isAuth: req.session.isLoggedIn
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/sign-up', {
    pageTitle: 'Signup',
    path: '/signup',
    oldInput: {
      name: '',
      email: '',
      mobileNumber: '',
    },
    isAuth: req.session.isLoggedIn
  });
};

exports.getAdminLogin = (req, res, next) => {
  res.render('admin/login', {
    pageTitle: 'Login',
    path: '/'
  })
}

exports.getAdminSignup = (req, res, next) => {
  res.render('admin/register', {
    pageTitle: 'Register',
    path: '/'
  })
}

exports.postAdminSignup = async (req, res, next) => {
  const username = req.body.text;
  const password = req.body.password;

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const adminAccount = new Admin({
      username,
      password: hashedPassword
    })
    const result = await adminAccount.save();
    console.log(`ADMIN CREATED`, result);

    return res.redirect('/admin/login');
  } catch (error) {
    const err = new Error(error);
    err.httpStatusCode = 500;
    return next(err);
  }
}

exports.postSignup = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const mobileNumber = req.body.mobileNumber;
  const password = req.body.password;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('auth/sign-up', {
      pageTitle: 'Signup',
      path: '/signup',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        name,
        email,
        mobileNumber,
      },
      isAuth: req.session.isLoggedIn
    });
  }

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

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('auth/login', {
      pageTitle: 'Login',
      path: '/login',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email,
      },
      isAuth: req.session.isLoggedIn
    });
  }

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


exports.postAdminLogin = async (req, res, next) => {
  const username = req.body.text;
  const password = req.body.password;

  try {
    const admin = await Admin.findOne({ username: username })
    if (!admin) {
      return res.redirect('/admin/login')
    }
    const doMatch = await bcrypt.compare(password, admin.password);
    if (doMatch) {
      req.session.adminIsLoggedIn = true;
      req.session.admin = admin;
      return req.session.save(err => {
        console.log(`Error:`, err);
        res.redirect('/admin/dashboard')
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

exports.postAdminLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(`LOGGED OUT`, err)
    res.redirect('/admin/login')
  })
}