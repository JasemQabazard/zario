const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');
const path = require('path');
const morgan=require('morgan');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const authentication = require('./routes/authentication');
const profilesRouter = require('./routes/profilesRouter');

const port = process.env.port || 8080;

mongoose.Promise = global.Promise;
// var dbURI = config.dburl;
// if (process.env.NODE_ENV === "production") {
//     dbURI = process.env.MONGODB_URI;
// }
// console.log('dbURI = ' + dbURI);
mongoose.connect(config.dburi, (err) => {
   if (err) {
      console.log('Could not connect to database: ', err);
   } else {
      console.log('connected to database: ', config.db);
   }
});
// mongoose.connect(config.mongoUrl);
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {
//     // we're connected!
//     console.log("Connected correctly to server");
// });

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('dev'));

// passport configuring
var User = require('./models/user');
app.use(passport.initialize());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(__dirname + '/public'));
app.use('/authentication', authentication);
app.use('/profiles', profilesRouter);

app.get('*', (req, res) => {
   res.sendFile(path.join(__dirname +'/public/index.html'));
});

app.listen(port, () => {
   console.log('Starting Server at localhost Port ' + port);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
   var err = new Error('Not Found');
   err.status = 404;
   next(err);
 });
 
 // error handlers
 
 // development error handler
 // will print stacktrace
 if (app.get('env') === 'development') {
     // Support CORS
     app.use(function (req, res, next) {
         res.header('Access-Control-Allow-Origin', '*');
         res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
         res.header('Content-Type', 'application/json')
         next();
     });
     app.use(function (err, req, res, next) {
         res.status(err.status || 500);
         res.json({
             message: err.message,
             error: err
         });
     });
 }
 
 // production error handler
 // no stacktraces leaked to user
 app.use(function(err, req, res, next) {
   res.status(err.status || 500);
   res.json({
     message: err.message,
     error: {}
   });
 });