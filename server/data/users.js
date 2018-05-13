var db = require('./db');
var mongoose = db.mongoose;

var userSchema = new mongoose.Schema({
  //唯一键，设备ID
  _id:{type:String,unique:true},
  //创建时间
  CreateTime:{type:Date},
  //用户姓名
  userName:{type:String},
  //用户性别
  userSex :{type:Number},
  //用户联系方式
  userTel:{type:String},
  //用户住址
  userAddr:{type:String},
  //用户订单
  userOrder:[String]
})
var userModel = mongoose.model('user',userSchema);

module.exports=userModel;
