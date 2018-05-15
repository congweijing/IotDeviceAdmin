var shortid = require("shortid");
var RepairModel = require('../data/repairs');
var async = require('async');
let repairController = {};

/**
 * 添加一条分类信息
 * @param req
 * @param res
 */
repairController.create = function (req, res) {
  let deviceId = req.body.deviceId;
  let connectName = req.body.connectName;
  let connectTel = req.body.connectTel;
  let repairContent = req.body.repairContent;

  let entity = new RepairModel({
    _id:shortid.generate(),
    deviceId: deviceId,
    CreateTime:new Date(),  //默认为当前时间
    connectName:connectName,
    connectTel:connectTel,
    repairContent:repairContent,
    done:0 //初始值为零
  });
  entity.save(function(err){
    if(err){
      console.log(err);
    }
  });
  res.json({"errcode": 0, "errmsg": "新增成功"})
};
//获取列表
repairController.findList = function (req, res) {
  //console.log(req.body);
  let page = parseInt(req.body.page || 1); //页码（默认第1页）
  let limit = parseInt(req.body.limit || 10); //每页显示条数（默认10条）
  let condition = {};
  let options = {};
  options.skip = (page-1)*limit;
  options.limit = limit;
  options.sort = "-CreateTime";
  let total = 0;

  async.parallel([
    //获取总数
    function(cb) {
      RepairModel.count(condition, function (err, count) {
        if (err) {
          cb(err);
        } else {
          cb(null,count);
        }
      })
    },
    //获取用户列表
    function(cb){
      RepairModel.find(condition,{},options,function(err,notes){
        if(err){
          cb(err);
        }else{
          cb(null,notes);
        }
      })
    }
  ], function(err, results) {
    //等上面两个执行完返回结果
    if(err){
      res.json({err:err});
    }else{
      res.json({
        total: results[0],
        limit: limit,
        notes: results[1]
      })
    }
  });
};

//删除一条记录
repairController.delete = function(req,res){
  let id = _.trim(req.params.id || '');
  let delcondition = {_id:id};
  if (!id) {
    return res.json({"errcode": 40002, "errmsg": "不合法的参数"});
  }
  RepairModel.remove(delcondition,function(err){
    if(err){
      console.log(err);
      res.json({"errcode": 40009, "errmsg": "处理失败"});
    }else{
      res.json({"errcode": 0, "errmsg": "修改成功"});
    }
  })
}


//根据id更新信息
repairController.update = function(req,res){
  let id = _.trim(req.params.id || '');
  let upcondition = {"_id":id};
  if (!id) {
    return res.json({"errcode": 40002, "errmsg": "不合法的参数"});
  }
  let update1 = {
    "_id":id,
    "done" : req.body.done,
  }
  RepairModel.update(upcondition,update1,function(err){
    if(err){
      console.log(err);
      res.json({"errcode": 40009, "errmsg": "处理失败"});
    }else{
      res.json({"errcode": 0, "errmsg": "修改成功"});
    }
  })
}

//获取未处理的总数
repairController.getNoteTotal = function(req,res){
  RepairModel.count({"done":0}, function (err, count) {
    if (err) {
      res.json({"errcode": 40009, "errmsg": "获取失败"});
    } else {
      res.json({"NoteTotal": count});
    }
  })
}
module.exports = repairController;
