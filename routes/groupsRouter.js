const express = require('express');
const bodyParser = require('body-parser');
const mogoose = require('mongoose');
const Groups = require('../models/groups');
const authenticate = require('../authenticate');
const cors = require('./cors');

const groupsRouter = express.Router();

groupsRouter.use(bodyParser.json());

groupsRouter.route('/') 
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
   Groups.find({})
   .then((groups) => {
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(groups);
   }, (err) => next(err))
   .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    console.log("posting group: ", req.body);
    Groups.create(req.body)
    .then((group) => {
         console.log('Group Created', group);
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(group);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   res.statusCode = 403;
   res.end('PUT operation not supported on / groups');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   Groups.remove({})
   .then((resp) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
   }, (err) => next(err))
   .catch((err) => next(err));
});

  /* ===============================================================
     Route to get and check if group record exists by username provided
  =============================================================== */
  groupsRouter.route('/byuser/:username')
  .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    // Use username to look for groups table belonging to the user 
    Groups.findOne({ username: req.params.username })
    .then((group) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(group);
    }, (err) => next(err))
    .catch((err) => next(err));
});

groupsRouter.route('/:groupId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
   Groups.findById(req.params.groupId)
    .then((group) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(group);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /group/'+ req.params.groupId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   Groups.findByIdAndUpdate(req.params.groupId, {
        $set: req.body
    }, { new: true })
    .then((group) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(group);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   Groups.findByIdAndRemove(req.params.groupId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = groupsRouter;
