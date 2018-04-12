const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');

mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
   if (err) {
      console.log('Could not connect to databse: ', err);
   } else {
      console.log('connected to database: ', config.db);
   }
});

app.use(express.static(__dirname + '/ng-zario/dist/'));

app.get('*', (req, res) => {
   res.sendFile(path.join(__dirname +'/ng-zarion/dist/index.html'));
});

app.listen(8080, () => {
   console.log('Starting Server at Port 8080');
});