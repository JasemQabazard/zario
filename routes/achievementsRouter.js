const express = require('express');
const bodyParser = require('body-parser');
const mogoose = require('mongoose');
const Achievements = require('../models/achievements');
const authenticate = require('../authenticate');
const cors = require('./cors');

const achievementsRouter = express.Router();

achievementsRouter.use(bodyParser.json());

achievementsRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
   Achievements.find({})
   .then((achievements) => {
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(achievements);
   }, (err) => next(err))
   .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   Achievements.create(req.body)
   .then((achievement) => {
         console.log('Achievement Created', achievement);
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(achievement);
   }, (err) => next(err))
   .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   res.statusCode = 403;
   res.end('PUT operation not supported on / Achievements');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   Achievements.remove({})
   .then((resp) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
   }, (err) => next(err))
   .catch((err) => next(err));
});

achievementsRouter.route('/:achievementId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
   Achievements.findById(req.params.achievementId)
    .then((achievement) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(achievement);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /achievement/'+ req.params.achievementId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
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
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   Achievements.findByIdAndRemove(req.params.achievementId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = achievementsRouter;
