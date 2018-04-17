//routes
require('./routes/memberRoutes');
var mongoose = require('mongoose');

//Mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/Library');
console.log('Mongoose is Sucessfully connected');

//Encoder Signature for JSON Web Token
module.exports.Encoder = 'RESTFULAPI';
