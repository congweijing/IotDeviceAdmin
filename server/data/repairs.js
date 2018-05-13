var db = require('./db');
var mongoose = db.mongoose;

var repairSchema = new mongoose.Schema({
  //唯一键，设备ID
  _id:{type:String,unique:true},
  //创建时间
  CreateTime:{type:Date},
  //设备ID
  deviceId:{type:String},
  //联系人 姓名
  connectName :{type:String},
  //联系方式
  connectTel:{type:String},
  //报修信息
  repairContent:{type:String},
  //是否处理
  done:{type:Number}
})
var repairModel = mongoose.model('repair',repairSchema);

module.exports=repairModel;
