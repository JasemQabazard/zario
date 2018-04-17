const express =require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const Verify = require('./verify');

router.get('/', (req,res,next) => {
   res.send('respond with all users')
});
router.post('/register', (req,res) => {
   console.log("/authentricate/register ---> reached");
   User.register(new User({username: req.body.username}),
   req.body.password, (err, user) => {
      if (err) {
         return res.status(500).json({err:err});
      }

      passport.authenticate('local')(req, res, () => {
         return res.status(200).json({status: 'Registration Successful'});
      });
   });

});

router.post('/login', (req, res, next) => {
   passport.authenticate('local', (err, user, info) => {
     if (err) {
             return next(err);
     }
     if (!user) {
             return res.status(401).json({
                 err: info
             });
     }
     req.logIn(user, (err) => {
             if (err) {
                     return res.status(500).json({
                     err: `Could not log in user ${err}`
                     });
             }
         
             console.log('User in users', user)
             var token = Verify.getToken({"username":user.username, "_id":user._id, "admin":user.admin});
         
             res.status(200).json({
                     status: 'Login successful!',
                     success: true,
                     token: token
             });
     });
   })(req,res,next);
 });

 router.post('/logout', (req, res) => {
   req.logOut();
   res.send(200).json({status: 'Bye!'});
});

   module.exports= router;
