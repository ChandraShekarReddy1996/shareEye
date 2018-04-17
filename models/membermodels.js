var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Library');

var Schema = mongoose.Schema;

var membersSchema = new Schema({
  firstName : {
    type : String,
    required : true,
    minlength :1,
    trim : true
  },
  LastName : {
    type : String,
    required : true,
    minlength :1
  },
  phone : {
    type : Number,
    required : true,
    maxlength : 10,
    trim : true
  },
  password : {
    type : String,
    required : true,
    maxlength : 10,
    trim : true
  },
  email : {
    type : String,
    match : [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] ,
    minlength : 5,
    required : true
  },
  address : {
    type : String,
    required : true,
    minlength :1
  }
})
module.exports = mongoose.model('members',membersSchema);

var myPics = new Schema ({
  pic : {
    type : String,
    required : true,
  },
  phone : {
    type : Number,
    required : true,
    minlength : 10,
    trim : true
  },
  owner : {
    type : Number,
    required : true,
    minlength : 10,
    trim : true
  }
})
module.exports = mongoose.model('myPics',myPics);

var pendingRequests = new Schema({
  sendersPhone : {
    type : Number,
    required : true,
    minlength : 10,
    trim : true
  },
  receiversPhone : {
    type : Number,
    required : true,
    minlength : 10,
    trim : true
  },
  description : {
    type : String,
    required : true,
    trim : true
  }
})
module.exports = mongoose.model('pendingRequests',pendingRequests);

var transactions = new Schema({
  SenderPhone:{
    type : Number,
    required : true,
    minlength : 10,
    trim : true
  },
  receiverPhone:{
    type : Number,
    required : true,
    minlength : 10,
    trim : true
  },
  file : {
    type : String,
    required : true,
    trim : true
  }
})
module.exports = mongoose.model('transactions',transactions);

var connections = new Schema({
  sendersPhone : {
    type : Number,
    required : true,
    minlength : 10,
    trim : true
  },
  receiversPhone : {
    type : Number,
    required : true,
    minlength : 10,
    trim : true
  }
})
module.exports = mongoose.model('connections',connections);
