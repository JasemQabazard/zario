const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
   'dburi': 'mongodb://localhost:27017/zario',
   // secret: crypto,
   'secretKey':'12398745630218907654',
   'db': 'zario'
}