const express = require('express');
const bodyParser = require('body-parser');
const mogoose = require('mongoose');
const Zario = require('../models/zario');
const authenticate = require('../authenticate');
const cors = require('./cors');
const nodemailer = require('nodemailer');

const zarioRouter = express.Router();

zarioRouter.use(bodyParser.json());

zarioRouter.route('/') 
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
   Zario.find({})
   .then((zarios) => {
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(zarios);
   }, (err) => next(err))
   .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   Zario.create(req.body)
   .then((zarios) => {
         console.log('Zario Created', zarios);
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(zarios);
   }, (err) => next(err))
   .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   res.statusCode = 403;
   res.end('PUT operation not supported on / zarios');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   Zario.remove({})
   .then((resp) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
   }, (err) => next(err))
   .catch((err) => next(err));
});

/* ==========================================================================
     Route to send user email of the cart transaction that occured to his account
  =========================================================================== */
  zarioRouter.post('/mailer', function (req, res, next) {
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
       subject: 'Zario & The Blackdiamond Loyalty Transaction',
       text: 'Dear Valued Member: Your transaction at our Merchant: ' + req.body.merchant + ' for purchase of: ' + req.body.description + ' for the amount of: ' + req.body.amount + ' and at an awarded discount of: ' + req.body.doiscount + ' has been fully registered to your account adding: ' + req.body.merits + ' merit points to your loyalty bands; as well as adding: ' + req.body.zarios + ' zario coins to your ownership. We thank you for your contribution. Please access your dashboard data to see your latest activity. Best Regards.',
       html: '<p>Dear Valued Member: Your transaction at our Merchant: </p><strong>' + req.body.merchant + '</strong><p> for purchase of: </p><strong>' + req.body.description + '</strong><p> for the amount of: </p><strong>' + req.body.amount + '</strong><p> and at an awarded discount of: </p><strong>' + req.body.discount + '</strong><p> has been fully registered to your account adding: </p><strong>' + req.body.merits + '</strong><p> merit points to your loyalty bands; as well as adding: </p><strong>' + req.body.zarios + '</strong><p> zario coins to your ownership. We thank you for your contribution. </p></p>Please access your dashboard data to see your latest activity. </p><p>Best Regards.</p><p>Zario and The Black Diamond Lawyalty Program.</p><p><strong>note: </strong> for any further enquiries please contact our Help Desk Suppprt.</p>'
   };
   transporter.sendMail(mailOptions, function (error, info) {
       if (error) {
           next(error);
       } else {
           res.status(200).json({
               status: 'Cart Transaction Email Message Sent' + info.response,
               success: true
           });
       }
   });
});

zarioRouter.route('/:zarioId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
   Zario.findById(req.params.zarioId)
    .then((zario) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(zario);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /Zario/'+ req.params.zarioId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   Zario.findByIdAndUpdate(req.params.zarioId, {
        $set: req.body
    }, { new: true })
    .then((zario) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(zario);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   Zario.findByIdAndRemove(req.params.zarioId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = zarioRouter;
