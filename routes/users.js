const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate');
const cors = require('./cors');
var nodemailer = require('nodemailer');

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

/* ============================================================
     Route to send user email with the verification code 
  ============================================================ */
router.post('/mailer', function (req, res, next) {
      var transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
              user: 'successarchitecture@gmail.com',
              pass: 'pbdqtlxogbdjonru'
          }
      });
      var mailOptions = {
          from: 'successarchitecture@gmail.com',
          to: req.body.email,
          subject: 'Your Registration Code is: ' + req.body.vcode,
          text: 'You have received this email because you attempted to register to zario.io and the black diamond loyalty program. Please enter your registration code in the application to continue with the registration process. Your Registration Code is: ' + req.body.vcode,
          html: '<p>You have received this email because you attempted to register to zario.io and the black diamond loyalty program. Please enter your registration code in the application to continue with the registration process. Your Registration Code is: </p>' + req.body.vcode 
      };
      transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
              next(err);
          } else {
              res.status(200).json({
                  status: 'Registration Code Message Sent' + info.response,
                  success: true
              });
          }
      });
});



  /* ============================================================
     Route to check if user's email is available for registration
  ============================================================ */
  router.get('/checkEmail/:email', (req, res) => {
    // Check if email was provided in paramaters
    if (!req.params.email) {
      res.json({ success: false, message: 'E-mail was not provided' }); // Return error
    } else {
      // Search for user's e-mail in database;
      User.findOne({ email: req.params.email }, (err, user) => {
        if (err) {
          res.statusCode  = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err}); 
          // Return connection error
        } else {
          // Check if user's e-mail is taken
          if (user) {
            res.json({ success: false, message: 'E-mail is already taken' }); // Return as taken e-mail
          } else {
            res.json({ success: true, message: 'E-mail is available' }); // Return as available e-mail
          }
        }
      });
    }
  });

  /* ===============================================================
     Route to check if user's username is available for registration
  =============================================================== */
  router.get('/checkUsername/:username', (req, res) => {
    // Check if username was provided in paramaters
    if (!req.params.username) {
      res.json({ success: false, message: 'Username was not provided' }); // Return error
    } else {
      // Look for username in database
      User.findOne({ username: req.params.username }, (err, user) => {
        // Check if connection error was found
        if (err) {
          res.statusCode  = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err}); 
          // Return connection error
        } else {
          // Check if user's username was found
          if (user) {
            res.json({ success: false, message: 'Username is already taken' }); // Return as taken username
          } else {
            res.json({ success: true, message: 'Username is available' }); // Return as vailable username
          }
        }
      });
    }
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
