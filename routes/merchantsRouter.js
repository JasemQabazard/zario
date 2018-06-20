const express = require('express');
const bodyParser = require('body-parser');
const mogoose = require('mongoose');
const Merchants = require('../models/merchants');
const authenticate = require('../authenticate');
const cors = require('./cors');

const merchantsRouter = express.Router();

merchantsRouter.use(bodyParser.json());

merchantsRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
   Merchants.find({})
   .then((merchants) => {
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(merchants);
   }, (err) => next(err))
   .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    console.log("req.body : ", req.body);
   Merchants.create(req.body)
   .then((merchant) => {
         console.log('Merchants Created', merchant);
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(merchant);
   }, (err) => next(err))
   .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   res.statusCode = 403;
   res.end('PUT operation not supported on / merchants');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   Merchants.remove({})
   .then((resp) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
   }, (err) => next(err))
   .catch((err) => next(err));
});
  /* ===============================================================
     Route to get and check if merchant record exists by username provided
  =============================================================== */
  merchantsRouter.route('/byuser/:username')
  .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    // Look for username in database
    console.log("username : ", req.params.username);
    Merchants.find({ username: req.params.username })
    .then((merchants) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(merchants);
    }, (err) => next(err))
    .catch((err) => next(err));
});

merchantsRouter.route('/:merchantId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
   Merchants.findById(req.params.merchantId)
    .then((merchant) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(merchant);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /merchant/'+ req.params.merchantId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    console.log("req.params.merchantId : ", req.params.merchantId);
    console.log("req.body : ", req.body);
   Merchants.findByIdAndUpdate(req.params.merchantId, {
        $set: req.body
    }, { new: true })
    .then((merchant) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(merchant);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   Merchants.findByIdAndRemove(req.params.merchantId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = merchantsRouter;
