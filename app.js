const path = require('path');
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const MONGODB_URI = 'mongodb+srv://andydev:123123dd@cluster0.jphuk.mongodb.net/capstone';
const errorController = require('./controllers/errorController')
const User = require('./models/user');
const Admin = require('./models/admin');
// multer config
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images/');
    },
    filename: (req, file, cb) => {
        cb(null, `${new Date().toISOString().replace(/:/g, '-')}${file.originalname.split(" ").join("_")}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

//initialize as an express app
const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',

});
//routes
const defaultRoutes = require('./routes/default');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
// template engine
app.set('view engine', 'pug');
app.set('views', 'views');

//parses incoming data to json on post requests
app.use(bodyParser.urlencoded({ extended: false }));
//multer 
app.use(
    multer({ storage: fileStorage }).single('image')
);

//exposes the public folder to the user
app.use(express.static(path.join(__dirname, 'public')));
//exposes the images folder to the user
app.use('/images', express.static(path.join(__dirname, 'images')));
//session middleware
app.use(session({ secret: 'my long secret', resave: false, saveUninitialized: false, store: store }))


//user middleware
app.use(async (req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    try {
        const user = await User.findById(req.session.user._id);
        if (!user) {
            return next();
        }
        req.user = user;
        next();
    } catch (error) {
        next(new Error(error));
    }
})

// admin middleware auth
app.use(async (req, res, next) => {
    if (!req.session.admin) {
        return next();
    }
    try {
        const admin = await Admin.findById(req.session.admin._id);
        if (!admin) {
            return next();
        }
        req.admin = admin;
        next();
    } catch (error) {
        next(new Error(error));
    }
})

//listen to routes
app.use("/admin", adminRoutes);
app.use(defaultRoutes);
app.use(authRoutes);

// error handling
app.get('/500', errorController.get500);
app.use((error, req, res, next) => {
    console.log(error)
    res.redirect('/500');
});

// connect to mongodb
mongoose
    .connect(MONGODB_URI)
    .then(result => {
        console.log('starting')
        // run the server
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });
