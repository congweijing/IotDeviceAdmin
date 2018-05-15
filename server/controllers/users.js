var shortid = require("shortid");
var UserModel = require('../data/users');
var CategoryModel = require('../data/devicecategory');
var async = require('async');
let userController = {};

/**
 * 添加一条分类信息
 * @param req
 * @param res
 */
userController.create = function (req, res) {
  let userSex = req.body.userSex;
  let userName = req.body.userName;
  let userTel = req.body.userTel;
  let userAddr = req.body.userAddr;

  let entity = new UserModel({
    _id:shortid.generate(),
    userName: userName,
    CreateTime:new Date(),  //默认为当前时间
    userTel:userTel,
    userSex:userSex,  //初始值为零
    userAddr:userAddr
  });
  entity.save(function(err){
    if(err){
      console.log(err);
    }
  });
  res.json({"errcode": 0, "errmsg": "新增成功"})
};
//获取用户列表
userController.findList = function (req, res) {
  //console.log(req.body);
  let page = parseInt(req.body.page || 1); //页码（默认第1页）
  let limit = parseInt(req.body.limit || 10); //每页显示条数（默认10条）
  let condition = {};
  let options = {};
  options.skip = (page-1)*limit;
  options.limit=limit;
  if(req.body.name){
    condition.userName = req.body.name;
  }
  let total = 0;

  async.parallel([
    //获取用户总数
    function(cb) {
      UserModel.count(condition, function (err, count) {
        if (err) {
          cb(err);
        } else {
          cb(null,count);
        }
      })
    },
    //获取用户列表
    function(cb){
      UserModel.find(condition,{},options,function(err,users){
        if(err){
          cb(err);
        }else{
          cb(null,users);
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
        users: results[1]
      })
    }
  });
};
//根据ID更新用户信息
userController.update = function(req,res){
  let id = _.trim(req.params.id || '');
  let upcondition = {"_id":id};
  if (!id) {
    return res.json({"errcode": 40002, "errmsg": "不合法的参数"});
  }
  let update1 = {
    "_id":id,
    "Name" : req.body.Name,
    "CreateTime":req.body.CreateTime,
    "userSex":req.body.userSex,
    "userTel":req.body.userTel,
    "userAddr":req.body.userAddr,
    "userOrder":req.body.userOrder
  }
  UserModel.update(upcondition,update1,function(err){
    if(err){
      console.log(err);
      res.json({"errcode": 40009, "errmsg": "处理失败"});
    }else{
      res.json({"errcode": 0, "errmsg": "修改成功"});
    }
  })
}

//删除单个用户
userController.delete = function(req,res){
  let id = _.trim(req.params.id || '');
  let delcondition = {_id:id};
  if (!id) {
    return res.json({"errcode": 40002, "errmsg": "不合法的参数"});
  }
  UserModel.remove(delcondition,function(err){
    if(err){
      console.log(err);
      res.json({"errcode": 40009, "errmsg": "处理失败"});
    }else{
      res.json({"errcode": 0, "errmsg": "修改成功"});
    }
  })
}

//批量删除
userController.deleteBatch = function(req,res){
  let ids = req.query.ids.split(',');
  //_Books = _Books.filter(b => !ids.includes(b.id))
  UserModel.remove({"_id":{$in:ids}},function(err){
    if(err){
      console.log(err);
      res.json({"errcode": 40009, "errmsg": "处理失败"});
    }else{
      res.json({"errcode": 0, "errmsg": "修改成功"});
    }
  })
}

//获取用户总数
userController.getUserTotal = function(req,res){
  UserModel.count(function (err, count) {
    if (err) {
      res.json({"errcode": 40009, "errmsg": "获取失败"});
    } else {
      res.json({"userTotal": count});
    }
  })
}

module.exports = userController;
