const express = require('express');
const bodyParser = require('body-parser');
const mogoose = require('mongoose');
const Groups = require('../models/groups');
const authenticate = require('../authenticate');

const groupsRouter = express.Router();

groupsRouter.use(bodyParser.json());

groupsRouter.route('/') 
.get((req, res, next) => {
   Groups.find({})
   .then((groups) => {
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(groups);
   }, (err) => next(err))
   .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
   Groups.create(req.body)
   .then((group) => {
         console.log('Group Created', group);
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(group);
   }, (err) => next(err))
   .catch((err) => next(err));
})
.put(authenticate.verifyUser, (req, res, next) => {
   res.statusCode = 403;
   res.end('PUT operation not supported on / groups');
})
.delete(authenticate.verifyUser, (req, res, next) => {
   Groups.remove({})
   .then((resp) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
   }, (err) => next(err))
   .catch((err) => next(err));
});

groupsRouter.route('/:groupId')
.get((req,res,next) => {
   Groups.findById(req.params.groupId)
    .then((group) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(group);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /group/'+ req.params.groupId);
})
.put(authenticate.verifyUser, (req, res, next) => {
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
.delete(authenticate.verifyUser, (req, res, next) => {
   Groups.findByIdAndRemove(req.params.groupId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = groupsRouter;
