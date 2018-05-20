var express = require('express');
var contactRouter = express.Router();
var nodemailer = require('nodemailer');

/* send contact support email. */
contactRouter.post('/', function (req, res, next) {
    // I was testing error handling return next(new Error('texting error handling'));
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'successarchitecture@gmail.com',
            pass: 'pbdqtlxogbdjonru'
        }
    });
    var mailOptions = {
        from: req.body.emailid,
        to: 'successarchitecture@gmail.com',
        subject: 'A Support Mesage From: ' + req.body.name, 
        text: 'View email in HTML',
        html: '<p>The contact support message states: </p><ul><li>subject: ' + req.body.subject + '</li><li>message: ' + req.body.message + '</li><li>email: ' + req.body.email + '</li></ul>'
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            next(err);
        } else {
            res.status(200).json({
                status: 'Contact us Message Sent' + info.response,
                success: true
            });
        }
    });
});

module.exports = contactRouter;