const path = require('path');
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://andydev:123123dd@cluster0.jphuk.mongodb.net/capstone';
const errorController = require('./controllers/errorController')

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

//routes
const defaultRoutes = require('./routes/default');
const adminRoutes = require('./routes/admin');

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

//listen to routes
app.use("/admin", adminRoutes);
app.use(defaultRoutes);


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
