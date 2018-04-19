const express = require('express');
const bodyParser = require('body-parser');
const mogoose = require('mongoose');
const Profiles = require('../models/profiles');
const authenticate = require('../authenticate');

const profilesRouter = express.Router();

profilesRouter.use(bodyParser.json());

profilesRouter.route('/') 
.get((req, res, next) => {
   Profiles.find({})
   .then((profiles) => {
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(profiles);
   }, (err) => next(err))
   .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
   Profiles.create(req.body)
   .then((profile) => {
         console.log('Profile Created', profile);
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(profile);
   }, (err) => next(err))
   .catch((err) => next(err));
})
.put(authenticate.verifyUser, (req, res, next) => {
   res.statusCode = 403;
   res.end('PUT operation not supported on / profi1les');
})
.delete(authenticate.verifyUser, (req, res, next) => {
   Profiles.remove({})
   .then((resp) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
   }, (err) => next(err))
   .catch((err) => next(err));
});

profilesRouter.route('/:profileId')
.get((req,res,next) => {
    Profiles.findById(req.params.profileId)
    .then((profile) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(profile);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /profiles/'+ req.params.profileId);
})
.put(authenticate.verifyUser, (req, res, next) => {
    Profiles.findByIdAndUpdate(req.params.profileId, {
        $set: req.body
    }, { new: true })
    .then((profile) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(profile);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Profiles.findByIdAndRemove(req.params.profileId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = profilesRouter;
