var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const config = require('dotenv') ;

const session = require('express-session')
var MongoDBStore = require('connect-mongodb-session')(session);

const cloudinary =require('./utils/cloudinary')
const fs = require('fs') 

var hbs = require('express-handlebars');
var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');
const mongoose = require('mongoose');
const productController = require('./controllers/productController');
const adminController = require('./controllers/adminController');
const { handlebars } = require('hbs');
const upload = require('./utils/multer');
const paypal = require('paypal-rest-sdk');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// =========================================
// ...........connecting mongodb............


const url = process.env.DATABASE_URL

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

mongoose.connect(url, connectionParams)
  .then(() => {
    console.log('Connected to the database ')
  })
  .catch((err) => {
    console.error(`Error connecting to the database. n${err}`);
  })

// =========================================
var store = new MongoDBStore({
  uri: url,
  collection: 'mySessions'
});

// catch errors
store.on('error', function (error) {
  console.log(error)
});



// <----------session---->
const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
  secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
  saveUninitialized: true,
  cookie: { maxAge: oneDay },
  store: store,
  resave: false

}));
//==========================

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': process.env.CLIENT_ID,
  'client_secret': process.env.SECRET  
});

app.use((req, res, next) => {
  res.set("cache-control", "no-store"); 
  next();
})


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')))

app.engine('.hbs', hbs.engine({
  extname: 'hbs',
  defaultLayout: 'layout', 
  layoutsDir: __dirname + '/views/layout/', 
  partialsDir: __dirname + '/views/partials', 
  helpers: {
    formatString(date) { 
      newdate = date.toUTCString()
      return newdate.slice(0, 16)
    },
    inc1: function (context) { 
      return context + 1
    },
    compareStrings: function(p,q,options){
      return (p == q) ? options.fn(this) : options.inverse(this);
    },
    multiply:function(f,l){
      return f*l
    },
    json:function(context) {
      return JSON.stringify(context);
    }
  }
}));  


                                        
app.use('/', usersRouter);
app.use('/admin', adminRouter);


app.use('/uploadImage', upload.array('images'), async (req, res) => { 
  const uploader = async (path) => await cloudinary.uploads(path, 'Banners')
    if (req.method === 'POST') { 
      const urls = [];
      const files = req.files
      for (const file of files) {
        const { path } = file
        const newPath = await uploader(path)
        urls.push(newPath)
        fs.unlinkSync(path)
      }
      res.status(200)
      res.json({ message: "Image uploaded", data: urls })
      console.log(urls)
      console.log(req.body);
    } else {
      res.status(405).json({ err: "image upload error" })
    }
  }
)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404)) 
});

app.disable('x-powered-by')


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app; 
