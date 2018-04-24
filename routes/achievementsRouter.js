const express = require('express');
const bodyParser = require('body-parser');
const mogoose = require('mongoose');
const Achievements = require('../models/achievements');
const authenticate = require('../authenticate');

const achievementsRouter = express.Router();

achievementsRouter.use(bodyParser.json());

achievementsRouter.route('/') 
.get((req, res, next) => {
   Achievements.find({})
   .then((achievements) => {
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(achievements);
   }, (err) => next(err))
   .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
   Achievements.create(req.body)
   .then((achievement) => {
         console.log('Achievement Created', achievement);
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(achievement);
   }, (err) => next(err))
   .catch((err) => next(err));
})
.put(authenticate.verifyUser, (req, res, next) => {
   res.statusCode = 403;
   res.end('PUT operation not supported on / Achievements');
})
.delete(authenticate.verifyUser, (req, res, next) => {
   Achievements.remove({})
   .then((resp) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
   }, (err) => next(err))
   .catch((err) => next(err));
});

achievementsRouter.route('/:achievementId')
.get((req,res,next) => {
   Achievements.findById(req.params.achievementId)
    .then((achievement) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(achievement);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /achievement/'+ req.params.achievementId);
})
.put(authenticate.verifyUser, (req, res, next) => {
   Achievements.findByIdAndUpdate(req.params.achievementId, {
        $set: req.body
    }, { new: true })
    .then((achievement) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(achievement);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
   Achievements.findByIdAndRemove(req.params.achievementId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = achievementsRouter;
