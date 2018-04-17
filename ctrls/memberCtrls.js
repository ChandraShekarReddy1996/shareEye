var dbService = require('/home/chandra/Desktop/jugnoo/Project/DB/mongoService')
const jwt = require('jsonwebtoken')
var index = require('/home/chandra/Desktop/jugnoo/Project/index')
var jwtDecode = require('jwt-decode')
var options ;

var registerMember = (req,res) => {
  dbService.find({phone : req.phone}, 'members',(err,result) => {
    if(err)
    {
      // throw err;
      res.status(404).send({message : 'Some Error Occured While Executing the script',status : 404, data : []})
    }
    else if(result && Object.keys(result).length)
    {
      res.status(400).send({message : 'Phone Number is already Registered', status: 200, data: {}})
    }
    else{

      var dat = {'firstName': req.firstName,'LastName':req.LastName,'phone':req.phone,'email':req.email, 'password': req.password,'address': req.address} ;
      dbService.create(dat,'members');
      res.status(201).send({message : 'Succesfully created', status: 200, data: dat})
    }
  })
}

var memberLogin = (req,res) => {
  dbService.find({phone : req.phone, password: req.password},'members',(err,result) => {
    console.log('>>>>' ,err,result);
    console.log("err ... res >>>>",err,result)
    if(err){
      res.status(400).send({message : 'SOme Error Occured While processing the application' ,status : 400 ,data : []});
    }
    else if(result == null)
    {
      res.send(401).send({message : 'Username/Password is incorrect' ,status : 401 , data : []})
    }
    else
    {
      console.log(index.Encoder)
      var token = jwt.sign(req, index.Encoder);
      res.status(200).send({message : 'Sucessful', status : 200 , data : {acces_token : token, name : result.firstName ,phone:req.phone}})
    }
  })
}

var getMembers = (req,res) => {
  var token = jwtDecode(req.headers.authorization);
  dbService.find({phone : token.phone ,password: token.password}, 'members',(err,result) => {
    if(err)
    {
      res.status(500).send({message : 'Some Error in processing the script' , status : 200 , data : []})
    }
    else if(result == null)
    {
      res.status(400).send({message : 'Username/password is incorrect' , status : 400 , data : []})
    }
    else
    {
      dbService.findAll('members',{},(err,result) => {
        if(err)
        {
          res.status(500).send({message : 'Some Error in processing the script' , status : 200 , data : []})
        }
        else{
          res.status(200).send({message : 'Sucessful' , status : 200 , data : result})
        }
      });
    }
  })
}

var addPhotos = (req,res) => {
  var token = jwtDecode(req.headers.authorization);
  dbService.find({phone : token.phone , password: token.password},'members',(err,result) => {
    if(err)
    {
      res.status(500).send({message : 'some error occured while processing the script', status : 500, data : []})
    }
    else if(result == null)
    {
      res.status(400).send({message : 'Username/password is incorrect' , status : 400 ,data : []})
    }
    else
    {
      if (!req.files)
      return res.status(400).send('No files were uploaded.');
      let sampleFile = req.files.sampleFile;
      var path = '/somewhere/on/your/server/filename.jpg';
      var dat = { 'pic' : path , phone : token.phone, owner : token.phone}
      sampleFile.mv('/somewhere/on/your/server/filename.jpg', function(result) {
        if (result)
        {
          dbService.create(dat,'myPics');
          res.status(200).send({message : 'Sucessful' , status : 200 , data :dat});
        }
        else{
          res.status(400).send({message : 'Some Error occured' , status : 400 , data : []})
        }
      })
    }
  })
}

//For loading the images in the front end
var getPhotos = (req,res) => {
  var token = jwtDecode(req.headers.authorization);

  dbService.find({phone : token.phone ,password: token.password}, 'members',(err,result) => {
    if(err)
    {
      res.status(500).send({message : 'Some Error in processing the script' , status : 200 , data : []})
    }
    else if(result == null)
    {
      res.status(400).send({message : 'Username/password is incorrect' , status : 400 , data : []})
    }
    else
    {
      dbService.findAll('myPics',{phone : token.phone},(err,result) => {
        if(err)
        {
          res.status(500).send({message : 'Some Error in processing the script' , status : 200 , data : []})
        }
        else{
          res.status(200).send({message : 'Sucessful' , status : 200 , data : result})
        }
      });
    }
  })
}

var sendPhoto = (req,res) => {
  var token = jwtDecode(req.headers.authorization);
  dbService.find({phone : token.phone , password : token.password}, 'members', (err,result) => {
    console.log('>>>>' ,err,result);
    if(err)
    {
      res.status(500).send({message : 'Some Error in processing the script' , status : 500 , data : []})
    }
    else
    {
      var dat = {'SenderPhone' : token.phone , 'receiverPhone' : req.body.revPhone ,'file' : req.body.path}
      var dat1 = {'pic' : req.body.path , 'phone' : req.body.revPhone , owner : token.phone}
      dbService.create(dat,'transactions');
      dbService.create(dat1,'myPics');
      res.status(200).send({message:'sucessful' , status : 200 , data : dat})
    }
  })
}

var sendRequest = (req,res) => {
  var token = jwtDecode(req.headers.authorization);
  dbService.find({phone : token.phone , password: token.password}, 'members' , (err,result) => {
    console.log('>>>>',err,result);
    if(err){
      res.status(500).send({message : 'Some Error in processing the script' , status : 500 , data : []})
    }
    else{
      dbService.find({phone : req.body.receiverPhone} , 'members' ,(err1,result1) => {
        console.log('>>>>' , err1 ,result1)
        if(err1){
          res.status(500).send({message : 'Some Error in processing the script' , status : 500 , data : []})
        }
        else if(result1 == null)
        {
          res.status(400).send({message : 'Plese Kindly Check the Receiver Phone Number' ,statua : 400 ,data : [{sender : result} , {receiver : result1}]})
        }
        else{
          var dat = {sendersPhone : token.phone , receiversPhone : req.body.receiverPhone , description : req.body.description}
          dbService.create(dat,'pendingRequests')
          res.status(200).send({message : 'sucessful' ,statua : 200 ,data : [{sender : result} , {receiver : result1}]})
        }
      })
    }
  })
}

var discardRequest = (req,res) => {
  var token = jwtDecode(req.headers.authorization);
  dbService.find({phone : token.phone , password : token.password}, 'members' , (err,result) => {
    if(err){
      res.status(500).send({message : 'Some Error in processing the script' , status : 500 , data : []})
    }
    else{
      dbService.clear({sendersPhone : req.body.phone , receiversPhone : token.phone}, 'pendingRequests', (err1,result1) => {
        if(err1){
          res.status(400).send({message : 'Some Error Occured Whle Discrading The Request' , status : 400 ,data : []})
        }
        else if(JSON.parse(result1).n == 0)
        {
          res.status(400).send({message : `No requsts from that ${req.body.phone}` , status : 400 ,data : []})
        }
        else{
          res.status(200).send({message:`Discarded the request from the ${req.body.phone}` , status : 200 , data : []})
        }
      })
    }
  })
}

var acceptRequest = (req,res) => {
  var token = jwtDecode(req.headers.authorization);
  dbService.find({phone : token.phone , password : token.password} , 'members' , (err,result) => {
    if(err){
      res.status(500).send({message : 'Some Error in processing the script' , status : 500 , data : []})
    }
    else{
      dbService.find({sendersPhone : req.body.phone , receiversPhone : token.phone}, 'pendingRequests', (err1,result1) => {
        if(err1){
          res.status(400).send({message : 'Some Error Occured Whle Discrading The Request' , status : 400 ,data : []})
        }
        else if (result1 == null) {
          res.status(400).send({message : `No requsts from that ${req.body.phone} in Pending Requests` , status : 400 ,data : []})
        }
        else{
          var dat = {sendersPhone : req.body.phone, receiversPhone : token.phone}
          dbService.create(dat, 'connections')
          dbService.clear({sendersPhone : req.body.phone , receiversPhone : token.phone}, 'pendingRequests', (err1,result1) => {
            if(err1){
              res.status(400).send({message : 'Some Error Occured Whle Accepting The Request' , status : 400 ,data : []})
            }
            else if(result1 == null)
            {
              res.status(400).send({message : `No requsts from that ${req.body.phone}` , status : 400 ,data : []})
            }
            else{
              res.status(200).send({message:`Accepted the request from the ${req.body.phone}` , status : 200 , data : []})
            }
          })
        }
      })
    }
  })
}

var removePhoto = (req,res) => {
  var token = jwtDecode(req.headers.authorization);
  dbService.find({phone : token.phone , pic : req.body.pic},'myPics',(err,result) => {
    console.log('>>>>' ,err,result);
    if(err)
    {
      res.status(500).send({message : 'Some Error in processing the script' , status : 500 , data : []})
    }
    else{
      dbService.clear({phone : token.phone , pic : req.body.pic},'myPics',(err,result) => {
        if(err){
          res.status(400).send({message : 'Some Error Occured whle Clearing the picture' , status : 400 ,data : []})
        }
        else{
          res.status(200).send({message:'sucessful' , status : 200 , data : []})
        }
      })
    }
  })
}

var updateProfile = (req,res) => {
  var token = jwtDecode(req.headers.authorization);
  dbService.find({phone : token.phone, password : token.password},'members',(err,result) => {
    console.log('>>>>' ,err,result);
    if(err)
    {
      res.status(500).send({message : 'Some Error in processing the script' , status : 500 , data : []})
    }
    else
    {
      var post = {name : req.body.name ,address : req.body.address};
      dbService.update({phone : token.phone},post,'members' ,(err,result) =>{
        if(err)
        {
          res.status(400).send({message : 'Some Error Occured' ,status :400 ,data :[]})
        }
        else{
          dbService.find({phone : token.phone},'members',(err,result) => {
            res.status(200).send({message: 'Sucessful' ,status : 200 ,data : [result]})
          })
        }
      })
    }
  })
}

module.exports = {
  registerMember,
  getMembers,
  addPhotos,
  getPhotos,
  sendPhoto,
  sendRequest,
  discardRequest,
  acceptRequest,
  removePhoto,
  updateProfile,
  memberLogin
};
