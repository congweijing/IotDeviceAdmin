var db = require('./db');
var mongoose = db.mongoose;

var categorySchema = new mongoose.Schema({
  //唯一键
  _id:{type:String,unique:true},
  //创建时间
  CreateTime:{type:Date},
  //分类名称
  CateName:{type:String}
})
var categoryModel = mongoose.model('category',categorySchema);

module.exports=categoryModel;
