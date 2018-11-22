const express = require('express');
const bodyParser = require('body-parser');
const mogoose = require('mongoose');
const Trans = require('../models/trans');
const authenticate = require('../authenticate');
const cors = require('./cors');

const transRouter = express.Router();

transRouter.use(bodyParser.json());

transRouter.route('/') 
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
   Trans.find({})
   .then((trans) => {
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(trans);
   }, (err) => next(err))
   .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   Trans.create(req.body)
   .then((trans) => {
         console.log('Trans Created', trans);
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(trans);
   }, (err) => next(err))
   .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   res.statusCode = 403;
   res.end('PUT operation not supported on / trans');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   Trans.remove({})
   .then((resp) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
   }, (err) => next(err))
   .catch((err) => next(err));
});

transRouter.route('/:tranId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
   Trans.findById(req.params.tranId)
    .then((trans) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(trans);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /tran/'+ req.params.tranId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   Trans.findByIdAndUpdate(req.params.tranId, {
        $set: req.body
    }, { new: true })
    .then((trans) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(trans);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   Trans.findByIdAndRemove(req.params.tranId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = transRouter;
