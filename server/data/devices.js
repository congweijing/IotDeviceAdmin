var db = require('./db');
var mongoose = db.mongoose;

var deviceSchema = new mongoose.Schema({
  //唯一键，设备ID
  _id:{type:String,unique:true},
  //创建时间
  CreateTime:{type:Date},
  //设备名称
  deviceName:{type:String},
  //设备所属分类
  deviceCate :{type:String},
  //设备状态
  deviceStatus:{type:Number},
  //设备备注
  deviceRemark:{type:String}
})
var deviceModel = mongoose.model('device',deviceSchema);

module.exports=deviceModel;
