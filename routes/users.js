const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate');
const cors = require('./cors');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
router.route('/') 
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, (req, res, next) => {
   User.find({})
   .then((users) => {
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(users);
   }, (err) => next(err))
   .catch((err) => next(err));
})

router.route('/register') 
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.post(cors.corsWithOptions, (req, res, next) => {
  User.register(new User({username: req.body.username}), 
  req.body.password, (err, user) => {
    if(err) {
      res.statusCode  = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    } else {
      console.log('body', req.body);
      if (req.body.email) 
      {
        user.email = req.body.email;
      }
      if (req.body.firstname)
      {
        user.firstname = req.body.firstname;
      } 
      if (req.body.lastname)
      {
        user.lastname = req.body.lastname;
      } 
      if (req.body.countrycode)
      {
        user.countrycode = req.body.countrycode;
      } 
      if (req.body.mobile)
      {
         user.mobile = req.body.mobile;
      }
      console.log('user', user);
      user.save((err, user) => {
        if (err) {
          res.statusCode  = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err + ' user save error'});
          return;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode  = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        });
      });
    }
  });
});

router.route('/login') 
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.post(cors.corsWithOptions, passport.authenticate('local'), (req, res) => {
  var token = authenticate.getToken({_id:req.user._id});
    res.statusCode  = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'Login Successful!'});
});

router.route('/logout') 
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.post(cors.corsWithOptions, (req, res) => {
  req.logOut();
  res.redirect('/');
  // res.send(200).json({status: 'Bye!'});
});

module.exports = router;
