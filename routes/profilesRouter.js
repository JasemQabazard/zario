const express = require('express');
const bodyParser = require('body-parser');
const profilesRouter = express.Router();

profilesRouter.use(bodyParser.json());

profilesRouter.route('/') 
.all((req, res, next) => {
   res.statusCode = 200;
   res.setHeader('Content-Type', 'text/plain');
   next();
})
.get((req, res, next) => {
   res.end('will send all the profiles to you');
})
.post((req, res, next) => {
   res.end('will add the profile: ' + req.body.name + 
         'with details: ' + req.body.description);
})
.put((req, res, next) => {
   res.statusCode = 403;
   res.end('PUT operation not supported on / profi1les');
})
.delete((req, res, next) => {
   res.end('Deleting all the profiles');
});

module.exports = profilesRouter;
