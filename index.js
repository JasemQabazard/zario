const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');
const fs=require('fs');

const app = express();
app.use(bodyParser.json());
const port = process.env.port || 8080;

mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
   if (err) {
      console.log('Could not connect to databse: ', err);
   } else {
      console.log('connected to database: ', config.db);
   }
});

app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {
   var now = new Date().toString();
   var log = `Server Log at: ${now}: ${req.method} ${req.url}`;

   console.log(log);
   fs.appendFile('server.log', log + '\n', (err) => {
      if (err) {
         console.log('Unable to write to server.log');
      }
   });
   next();
});

app.get('*', (req, res) => {
   res.sendFile(path.join(__dirname +'/public/index.html'));
});

app.listen(port, () => {
   console.log('Starting Server at Port ' + port);
});