const express = require('express');
const bodyParser = require('body-parser');
const mogoose = require('mongoose');
const CRM = require('../models/crm');
const authenticate = require('../authenticate');
const cors = require('./cors');

const crmRouter = express.Router();

crmRouter.use(bodyParser.json());

crmRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
   CRM.find({})
   .then((crms) => {
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(crms);
   }, (err) => next(err))
   .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   CRM.create(req.body)
   .then((crm) => {
         console.log('CRM Created', crm);
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(crm);
   }, (err) => next(err))
   .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   res.statusCode = 403;
   res.end('PUT operation not supported on / Achievements');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   CRM.remove({})
   .then((resp) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
   }, (err) => next(err))
   .catch((err) => next(err));
});

crmRouter.route('/:crmId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
   CRM.findById(req.params.crmId)
    .then((crm) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(crm);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /achievement/'+ req.params.crmId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   CRM.findByIdAndUpdate(req.params.crmId, {
        $set: req.body
    }, { new: true })
    .then((crm) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(crm);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   CRM.findByIdAndRemove(req.params.crmId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = crmRouter;
