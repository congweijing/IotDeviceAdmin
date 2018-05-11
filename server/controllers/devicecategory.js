/**
 * books 控制器
 * Created by jerry on 2017/11/2.
 */
var shortid = require("shortid");
var CategoryModel = require('../data/devicecategory');
let categoryController = {};

/**
 * 添加一条分类信息
 * @param req
 * @param res
 */
categoryController.create = function (req, res) {
  let CateName = req.body.CateName;
  let entity = new CategoryModel({
    _id:shortid.generate(),
    CateName: CateName,
    CreateTime:new Date()
  });
  entity.save(function(err){
    if(err){
      console.log(err);
    }
  });
  res.json({"errcode": 0, "errmsg": "新增成功"})
};
/*获取全部分类数据*/
categoryController.findList = function (req,res) {
  CategoryModel.find(function(err,categories){
    if(err){
      console.log(err);
    }
    else{
      res.json(categories);
    }
  })
}
/*更新分类名称*/
categoryController.update = function (req,res){
  let id = _.trim(req.params.id || '');
  let upcondition = {"_id":id};
  if (!id) {
    return res.json({"errcode": 40002, "errmsg": "不合法的参数"});
  }
  let update1 = {
    "_id":id,
    "CateName" : req.body.CateName,
    "CreateTime":req.body.CreateTime
  }
  CategoryModel.update(upcondition,update1,function(err){
    if(err){
      console.log(err);
      res.json({"errcode": 40009, "errmsg": "处理失败"});
    }else{
      res.json({"errcode": 0, "errmsg": "修改成功"});
    }
  })
}
/*删除分类名称*/
categoryController.delete = function (req,res){
  let id = _.trim(req.params.id || '');
  let delcondition = {_id:id};
  if (!id) {
    return res.json({"errcode": 40002, "errmsg": "不合法的参数"});
  }
  CategoryModel.remove(delcondition,function(err){
    if(err){
      console.log(err);
      res.json({"errcode": 40009, "errmsg": "处理失败"});
    }else{
      res.json({"errcode": 0, "errmsg": "修改成功"});
    }
  })
}
module.exports = categoryController;
