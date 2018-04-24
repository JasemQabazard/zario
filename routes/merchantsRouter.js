const express = require('express');
const bodyParser = require('body-parser');
const mogoose = require('mongoose');
const Merchants = require('../models/merchants');
const authenticate = require('../authenticate');

const merchantsRouter = express.Router();

merchantsRouter.use(bodyParser.json());

merchantsRouter.route('/') 
.get((req, res, next) => {
   Merchants.find({})
   .then((merchants) => {
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(merchants);
   }, (err) => next(err))
   .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
   Merchants.create(req.body)
   .then((merchant) => {
         console.log('Merchants Created', merchant);
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(merchant);
   }, (err) => next(err))
   .catch((err) => next(err));
})
.put(authenticate.verifyUser, (req, res, next) => {
   res.statusCode = 403;
   res.end('PUT operation not supported on / merchants');
})
.delete(authenticate.verifyUser, (req, res, next) => {
   Merchants.remove({})
   .then((resp) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
   }, (err) => next(err))
   .catch((err) => next(err));
});

merchantsRouter.route('/:customerId')
.get((req,res,next) => {
   Merchants.findById(req.params.merchantId)
    .then((merchant) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(merchant);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /merchant/'+ req.params.merchantId);
})
.put(authenticate.verifyUser, (req, res, next) => {
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
.delete(authenticate.verifyUser, (req, res, next) => {
   Merchants.findByIdAndRemove(req.params.merchantId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = merchantsRouter;
