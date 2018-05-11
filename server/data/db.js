var mongoose = require("mongoose");

var DbPath = "mongodb://localhost/IotDeviceAdmin";
mongoose.Promise = global.Promise;
mongoose.connect(DbPath,{useMongoClient: true},function(err){
  if(!err){
    console.log("connected to the IotDeviceAdmin")
  }else{
    throw err;
  }
});
mongoose.connection.on('connected', function () {
  console.log('Mongoose connection open to ' + DbPath);
});
exports.mongoose = mongoose;
