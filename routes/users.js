const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate');
const cors = require('./cors');
const nodemailer = require('nodemailer');

const router = express.Router();
router.use(bodyParser.json());

router.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); } )

router.route('/') 
.get(cors.corsWithOptions, (req, res, next) => {
   User.find({})
   .then((users) => {
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(users);
   }, (err) => next(err))
   .catch((err) => next(err));
})

  /* ===============================================================
     Route to get user by username  for user data update 
  =============================================================== */
  router.get('/userUpdate/:username', (req, res) => {
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
          res.statusCode  = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(user); // Return user 
        }
      });
    }
  });

  /* ===============================================================
     Route to put user by userId  for user data update 
  =============================================================== */
  router.put('/:userId', cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    User.findByIdAndUpdate(req.params.userId, {
         $set: req.body
     }, { new: true })
     .then((user) => {
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(user);
     }, (err) => next(err))
     .catch((err) => next(err));
 })

/* ============================================================
     Route user password change does not require mailer
     requires sending teh user name and the new password 
  ============================================================ */
router.post('/passwordchange', (req, res, next) => {
  User.findByUsername(req.body.username).then(
    (user) => {
      if (user)
      {
          user.setPassword(req.body.password, 
            (err) => {
              if (err) return next(err);
              user.save(
                (err) => {
                  console.log(err);
                  if (err) return next(err);
                  res.status(200).json({ status: 'password change Successful!' });
              });
          });
      } 
  }, (err) => {
      next(err);
  });
});

/* ============================================================
     Route for resetting user password 
     requires mailing the OTP to the user first from the angular 
     front end and when receiving correct code 
     call this server post to do the reset
     requiures sending email id and the new password
  ============================================================ */
router.post('/passwordreset', (req, res, next) => {
  User.findOne({ email: req.body.email }, 
    (err, user) => {
      if (user) {
          user.setPassword(req.body.password, 
            (err) => {
              if (err) return next(err);
              user.save(
                (err) => {
                  console.log(err);
                  if (err) return next(err);
                  res.status(200).json({ status: 'password reset Successful!' });
              });
          });
      }
  });
});

/* ============================================================
     Route to user's registration to application
  ============================================================ */
router.route('/register') 
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
      if (req.body.role)
      {
        user.role = req.body.role;
      } 
      if (req.body._gid)
      {
        user._gid = req.body._gid;
      } 
      if (req.body._mid)
      {
         user._mid = req.body._mid;
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

/* ==========================================================================
     Route to send user email with the verification code used in registration
  =========================================================================== */
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
              next(error);
          } else {
              res.status(200).json({
                  status: 'Registration Code Message Sent' + info.response,
                  success: true
              });
          }
      });
});


/* ==========================================================================
     Route to send user / customer MADD email with the username, password 
  =========================================================================== */
  router.post('/maddmailer', function (req, res, next) {
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
        subject: 'Your Registration Information',
        text: 'You are receiving this email because the merchant:'+ req.body.merchantname +  'registered you to zario.io and the black diamond loyalty program. Your username is: ' +req.body.username + 'and your password is: '+ req.body.password+ 'Please visit our application at: www.zario.io.com and sign on to complete the registration process.',
        html: '<p>You are receiving this email because the merchant: </p>' + req.body.merchantname + '<p>registered you to zario.io and the black diamond loyalty program. Your username is: </p>' + req.body.username + '<p>and your password is: </p>' +req.body.password + '<p>Please visit our application at: www.zario.io.com and sign on to complete the registration process.</p>'
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            next(error);
        } else {
            res.status(200).json({
                status: 'Madd Mail Registration Message Sent' + info.response,
                success: true
            });
        }
    });
});

/* ============================================================
     Route send email for forget the password requires the email id 
     and the password generated OTP-ONE TIME PASSWORD
  ============================================================ */
router.post('/passwordcodemailer', function (req, res, next) {
  console.log(req.body);
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
        subject: 'Your Forget Password Code is: ' + req.body.vcode,
        text: 'You received this email because you are attempting to reset your Forgotten Password. If you wish to continue with this process please enter the following verification code in the allowed field in the application: ' + req.body.vcode,
        html: '<p>You received this email because you are attempting to reset your Forgotten Password.</p><br><p> If you wish to continue with the process please enter the following verification code in the allowed field in the application: </p><strong>' + req.body.vcode +'</strong>'
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
            next(error);
        } else {
            console.log('password forget code email sent');
            res.status(200).json({
                status: 'password forget Code Message Sent' + info.response,
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

    /* ============================================================
     Route to get user record by email for cart transaction processing
  ============================================================ */
  router.get('/getUserbyemail/:email', (req, res) => {
    // Check if email was provided in paramaters
    if (!req.params.email) {
      res.json({ success: false, message: 'Mobile was not provided' }); // Return error
    } else {
      // Search for user's by email in database;
      User.findOne({ email: req.params.email }, (err, user) => {
        if (err) {
          res.statusCode  = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err}); 
          // Return connection error
        } else {
          res.statusCode  = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(user); // Return user 
        }
      });
    }
  });

    /* ============================================================
     Route to get user record by mobile number for cart transaction processing
  ============================================================ */
  router.get('/getUserbymobile/:mobile', (req, res) => {
    // Check if mobile was provided in paramaters
    if (!req.params.mobile) {
      res.json({ success: false, message: 'Mobile was not provided' }); // Return error
    } else {
      // Search for user's by mobile in database;
      User.findOne({ mobile: req.params.mobile }, (err, user) => {
        if (err) {
          res.statusCode  = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err}); 
          // Return connection error
        } else {
          res.statusCode  = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(user); // Return user 
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

  router.post('/login', cors.corsWithOptions, (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
          if (err)
            {return next(err);}
          if (!user) {
            return res.status(401).json({success: false, status: 'Login Unsuccessful!', err: info});
          } 
          req.logIn(user, (err) => {
          if (err) {
            return res.status(401).json({success: false, status: 'Login Unsuccessful!', 
              err: 'Could not log in User'});
          }   
            var token = authenticate.getToken({_id: req.user._id});
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, message: 'Login Successful!', token: token, role: user.role, realname:user.firstname+" "+user.lastname});
        }); 
    }) (req, res, next);
  });

  // checks the old password for the password change function 
  // this is done in line with the data entry of the form
  //
  router.post('/checkOldPassword', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err)
        {return next(err);}
      if (!user) {
        return res.status(200).json({success: false, message: 'Old Password not Correct!'});
      } else {
        return res.status(200).json({success: true, message: 'Old Password Correct'});
      }
    }) (req, res, next);
  });

router.route('/logout') 
.post(cors.corsWithOptions, (req, res) => {
  req.logOut();
  res.redirect('/');
  // res.send(200).json({status: 'Bye!'});
});

router.get('/checkJWTToken', (req, res) => {
  passport.authenticate('jwt', {session: false}, (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      return res.status(401).json({success: false, status: 'JWT invalid!', err: info});
    }
    else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT valid!', success: true, user: user});
    }
  }) (req, res); 
});

module.exports = router;
