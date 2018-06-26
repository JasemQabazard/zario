const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const authenticate = require('../authenticate');
const multer = require('multer');
const cors = require('./cors');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/avatars/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
var maxFileSize = 500000; // limit your images uploads to 500K Byte.
const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
};

// const upload = multer({ storage: storage, fileFilter: imageFileFilter});
const upload = multer({ storage: storage, fileFilter: imageFileFilter,limits: { fileSize: maxFileSize }}).single('imageFile');

const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    upload(req, res, (err)  => {
        if (err) {
            res.statusCode  = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(req.file);
        }
    });
}); 

module.exports = uploadRouter;