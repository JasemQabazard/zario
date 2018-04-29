const express = require('express');
const bodyParser = require('body-parser');
const mogoose = require('mongoose');
const Customers = require('../models/customers');
const authenticate = require('../authenticate');
const cors = require('./cors');

const customersRouter = express.Router();

customersRouter.use(bodyParser.json());

customersRouter.route('/') 
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
   Customers.find({})
   .then((customers) => {
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(customers);
   }, (err) => next(err))
   .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   Customers.create(req.body)
   .then((customer) => {
         console.log('Customer Created', customer);
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(customer);
   }, (err) => next(err))
   .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   res.statusCode = 403;
   res.end('PUT operation not supported on / customers');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   Customers.remove({})
   .then((resp) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
   }, (err) => next(err))
   .catch((err) => next(err));
});

customersRouter.route('/:customerId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Customers.findById(req.params.customerId)
    .then((customer) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(customer);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /customer/'+ req.params.customerId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Customers.findByIdAndUpdate(req.params.customerId, {
        $set: req.body
    }, { new: true })
    .then((customer) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(customer);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Customers.findByIdAndRemove(req.params.customerId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = customersRouter;
