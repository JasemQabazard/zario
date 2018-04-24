const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const authenticate = require('./authenticate');
const config = require('./config');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const customersRouter = require('./routes/customersRouter');
const achievementsRouter = require('./routes/achievementsRouter');
const groupsRouter = require('./routes/groupsRouter');
const merchantsRouter = require('./routes/merchantsRouter');
const promotionsRouter = require('./routes/promotionsRouter');
const settingsRouter = require('./routes/settingsRouter');
const socialsRouter = require('./routes/socialsRouter');
const transRouter = require('./routes/transRouter');

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

// Connection URL
const url = config.mongoUrl;
const connect = mongoose.connect(url, {
    // useMongoClient: true, -----------deprecated--------------
    /* other options */
  });

connect.then((db) => {
    console.log("Connected correctly to MOGODB server");
}, (err) => { console.log(err); });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/customers', customersRouter);
app.use('/groups', groupsRouter);
app.use('/merchants', merchantsRouter);
app.use('/promotions', promotionsRouter);
app.use('/settings', settingsRouter);
app.use('/socials', socialsRouter);
app.use('/trans', transRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
