const express = require('express');
const bodyParser = require('body-parser');
const mogoose = require('mongoose');
const Settings = require('../models/settings');
const authenticate = require('../authenticate');
const cors = require('./cors');

const settingsRouter = express.Router();

settingsRouter.use(bodyParser.json());

settingsRouter.route('/') 
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
   Settings.find({})
   .then((settings) => {
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(settings);
   }, (err) => next(err))
   .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   Settings.create(req.body)
   .then((setting) => {
         console.log('Setting Created', setting);
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(setting);
   }, (err) => next(err))
   .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   res.statusCode = 403;
   res.end('PUT operation not supported on / setting');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   Settings.remove({})
   .then((resp) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
   }, (err) => next(err))
   .catch((err) => next(err));
});

settingsRouter.route('/:settingId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
   Settings.findById(req.params.settingId)
    .then((setting) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(setting);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /setting/'+ req.params.settingId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   Settings.findByIdAndUpdate(req.params.settingId, {
        $set: req.body
    }, { new: true })
    .then((setting) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(setting);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   Settings.findByIdAndRemove(req.params.settingId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = settingsRouter;
