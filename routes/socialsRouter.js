const express = require('express');
const bodyParser = require('body-parser');
const mogoose = require('mongoose');
const Socials = require('../models/socials');
const authenticate = require('../authenticate');
const cors = require('./cors');

const socialsRouter = express.Router();

socialsRouter.use(bodyParser.json());

socialsRouter.route('/') 
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
   Socials.find({})
   .then((socials) => {
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(socials);
   }, (err) => next(err))
   .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   Socials.create(req.body)
   .then((social) => {
         console.log('Social Created', social);
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(social);
   }, (err) => next(err))
   .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   res.statusCode = 403;
   res.end('PUT operation not supported on / socials');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   Socials.remove({})
   .then((resp) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
   }, (err) => next(err))
   .catch((err) => next(err));
});

socialsRouter.route('/:socialId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
   Socials.findById(req.params.socialId)
    .then((social) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(social);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /social/'+ req.params.socialId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
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
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   Socials.findByIdAndRemove(req.params.socialId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

// for comments end points ================

socialsRouter.route('/:socialId/comments')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Socials.findById(req.params.socialId)
    .then((social) => {
        if (social != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(social.comments);
        }
        else {
            err = new Error('Social ' + req.params.socialId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    console.log(req.params.socialId, req.body);
    Socials.findById(req.params.socialId)
    .then((social) => {
        if (social != null) {
            social.comments.push(req.body);
            social.save()
            .then((social) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(social);                
            }, (err) => next(err));
        }
        else {
            err = new Error('Social ' + req.params.socialId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /socials/'
        + req.params.socialId + '/comments');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Socials.findById(req.params.socialId)
    .then((social) => {
        if (social != null) {
            for (var i = (social.comments.length -1); i >= 0; i--) {
                social.comments.id(social.comments[i]._id).remove();
            }
            social.save()
            .then((social) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(social);                
            }, (err) => next(err));
        }
        else {
            err = new Error('Social ' + req.params.socialId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
});

socialsRouter.route('/:socialId/comments/:commentId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Socials.findById(req.params.socialId)
    .then((social) => {
        if (social != null && social.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(social.comments.id(req.params.commentId));
        }
        else if (social == null) {
            err = new Error('Social ' + req.params.socialId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /socials/'+ req.params.socialId
        + '/comments/' + req.params.commentId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Socials.findById(req.params.socialId)
    .then((social) => {
        if (social != null && social.comments.id(req.params.commentId) != null) {
            if (req.body.comment) {
                social.comments.id(req.params.commentId).comment = req.body.comment;                
            }
            social.save()
            .then((social) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(social);                
            }, (err) => next(err));
        }
        else if (social == null) {
            err = new Error('Social ' + req.params.socialId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Socials.findById(req.params.socialId)
    .then((social) => {
        if (social != null && social.comments.id(req.params.commentId) != null) {
            social.comments.id(req.params.commentId).remove();
            social.save()
            .then((social) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(social);                
            }, (err) => next(err));
        }
        else if (social == null) {
            err = new Error('Social ' + req.params.socialId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = socialsRouter;
