const express = require('express');
const bodyParser = require('body-parser');
const mogoose = require('mongoose');
const Socials = require('../models/socials');
const authenticate = require('../authenticate');

const socialsRouter = express.Router();

socialsRouter.use(bodyParser.json());

socialsRouter.route('/') 
.get((req, res, next) => {
   Socials.find({})
   .then((socials) => {
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(socials);
   }, (err) => next(err))
   .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
   Socials.create(req.body)
   .then((social) => {
         console.log('Social Created', social);
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(social);
   }, (err) => next(err))
   .catch((err) => next(err));
})
.put(authenticate.verifyUser, (req, res, next) => {
   res.statusCode = 403;
   res.end('PUT operation not supported on / socials');
})
.delete(authenticate.verifyUser, (req, res, next) => {
   Socials.remove({})
   .then((resp) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
   }, (err) => next(err))
   .catch((err) => next(err));
});

socialsRouter.route('/:socialId')
.get((req,res,next) => {
   Socials.findById(req.params.socialId)
    .then((social) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(social);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /social/'+ req.params.socialId);
})
.put(authenticate.verifyUser, (req, res, next) => {
   Socials.findByIdAndUpdate(req.params.socialId, {
        $set: req.body
    }, { new: true })
    .then((social) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(social);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
   Socials.findByIdAndRemove(req.params.socialId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = socialsRouter;
