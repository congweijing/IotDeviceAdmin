var shortid = require("shortid");
var DeviceModel = require('../data/devices');
var CategoryModel = require('../data/devicecategory');
var async = require('async');
let deviceController = {};

/**
 * 添加一条分类信息
 * @param req
 * @param res
 */
deviceController.create = function (req, res) {
  let deviceId = req.body.deviceId;
  let deviceName = req.body.deviceName;
  let deviceCate = req.body.deviceCate;
  let deviceRemark = req.body.deviceRemark;

  let entity = new DeviceModel({
    _id:deviceId,
    deviceName: deviceName,
    CreateTime:new Date(),  //默认为当前时间
    deviceCate:deviceCate,
    deviceStatus:0,  //初始值为零
    deviceRemark:deviceRemark
  });
  entity.save(function(err){
    if(err){
      console.log(err);
      res.json({"errcode": 40009, "errmsg": "新增失败，换一个ID试试"})
    }else{
      res.json({"errcode": 0, "errmsg": "新增成功"})
    }
  });

}

/*获取所有设备列表*/
deviceController.findAllList = function (req,res){
  DeviceModel.find(function(err,devices) {
    if (err) {
      console.log(err);
      res.json({"errcode": 40009, "errmsg": "处理失败"});
    } else {
      res.json({
        devices: devices
      })
    }
  });
}
/*根据参数获取设备列表*/
deviceController.findList = function (req, res) {
  //console.log(req.body);
  let page = parseInt(req.body.page || 1); //页码（默认第1页）
  let limit = parseInt(req.body.limit || 10); //每页显示条数（默认10条）
  let condition = {};
  let options = {};
  options.skip = (page-1)*limit;
  options.limit=limit;
  if(req.body.name){
    condition.deviceName = req.body.name;
  }
  let total = 0;

  async.parallel([
    //获取设备总数
      function(cb) {
        DeviceModel.count(condition, function (err, count) {
          if (err) {
            cb(err);
          } else {
            cb(null,count);
          }
        })
      },
    //获取设备列表
      function(cb){
        DeviceModel.find(condition,{},options,function(err,devices){
          if(err){
            cb(err);
          }else{
            cb(null,devices);
          }
        })
      },
    //获取设备分类列表
      function(cb){
        CategoryModel.find(function(err,categories){
          if(err){
            cb(err);
          }
          else{
            cb(null,categories);
          }
        })
      }
  ], function(err, results) {
      //等上面两个执行完返回结果
    if(err){
      res.json({err:err});
    }else{
      let rltDevices = results[1];
      let categories = results[2];
      rltDevices.forEach(function(deviceItem){
        categories.forEach(function(cateItem){
          if(deviceItem.deviceCate == cateItem._id){
            deviceItem.deviceCate = cateItem.CateName;
          }
        })
        if(deviceItem.deviceCate == "other"){
          deviceItem.deviceCate = "未分类";
        }
      })
      res.json({
        total: results[0],
        limit: limit,
        devices: rltDevices
      })
    }
  });
}

//根据id更新设备信息
deviceController.update = function(req,res){
  let id = _.trim(req.params.id || '');
  let upcondition = {"_id":id};
  if (!id) {
    return res.json({"errcode": 40002, "errmsg": "不合法的参数"});
  }
  let update1 = {
    "_id":id,
    "deviceName" : req.body.deviceName,
    "CreateTime":req.body.CreateTime,
    "deviceCate":req.body.deviceCate,
    "deviceStatus":req.body.deviceStatus,
    "deviceRemark":req.body.deviceRemark
  }
  DeviceModel.update(upcondition,update1,function(err){
    if(err){
      console.log(err);
      res.json({"errcode": 40009, "errmsg": "处理失败"});
    }else{
      res.json({"errcode": 0, "errmsg": "修改成功"});
    }
  })
}

//根据ID删除设备
deviceController.delete = function(req,res){
  let id = _.trim(req.params.id || '');
  let delcondition = {_id:id};
  if (!id) {
    return res.json({"errcode": 40002, "errmsg": "不合法的参数"});
  }
  DeviceModel.remove(delcondition,function(err){
    if(err){
      console.log(err);
      res.json({"errcode": 40009, "errmsg": "处理失败"});
    }else{
      res.json({"errcode": 0, "errmsg": "修改成功"});
    }
  })
}

//批量删除
deviceController.deleteBatch = function(req,res){
  let ids = req.query.ids.split(',');
  //_Books = _Books.filter(b => !ids.includes(b.id))
  DeviceModel.remove({"_id":{$in:ids}},function(err){
    if(err){
      console.log(err);
      res.json({"errcode": 40009, "errmsg": "处理失败"});
    }else{
      res.json({"errcode": 0, "errmsg": "修改成功"});
    }
  })
}

//获取status为0的设备列表
deviceController.findListByStatus = function (req, res) {
  let condition = {"deviceStatus":0};
  let options = {};
  options.sort = "deviceCate";
  DeviceModel.find(condition,{},options,function(err,devices){
    if(err){
      res.json({err:err});
    }else{
      res.json({
        devices: devices
      })
    }
  });
}

//根据ids获取设备列表
deviceController.findListByIds = function(req,res){
  let ids = req.body.ids.split(',');
  DeviceModel.find({"_id":{$in:ids}},function(err,devices){
    if(err){
      res.json({err:err});
    }else{
      res.json({
        devices: devices
      })
    }
  })
}

//根据IDS批量更新设备状态Status
deviceController.updateStatusBatch = function(req,res){

  let idsa = req.body.idsa.split(',');
  let idsb = req.body.idsb.split(',');
  console.log(idsa);
  console.log(idsb);
  async.parallel([
    //获取设备总数
    function(cb) {
      DeviceModel.update({"_id":{$in:idsa}},{deviceStatus:0},{multi:true}, function (err) {
        if (err) {
          cb(err);
        } else {
          cb(null,"ok1");
        }
      });
    },
    //获取设备列表
    function(cb){
      DeviceModel.update({"_id":{$in:idsb}},{"deviceStatus":1},{multi:true},function (err) {
        if (err) {
          cb(err);
        } else {
          cb(null,"ok2");
        }
      });
    }
  ], function(err, results) {
    //等上面两个执行完返回结果
    if(err){
      res.json({"errcode": 40009, "errmsg": "处理失败"});
    }else{
      res.json({"errcode": 0, "errmsg": "修改成功"});
    }
  });
}

//获取设备总数和不同分类的设备数
deviceController.getDeviceTotal = function(req,res){
  let condition = {};
  let options = {};
  let total = 0;
  async.parallel([
    //获取设备总数
    function(cb) {
      DeviceModel.count(function (err, total) {
        if (err) {
          cb(err);
        } else {
          cb(null,total);
        }
      })
    },
    //获取设备分类列表 以及分类列表对应的设备数
    function(cb){
      async.waterfall([
          function(cb){
            CategoryModel.find(function(err,categories){
              if(err){
                cb(err);
              }
              else{
                cb(null,categories);
              }
            })
          },
          //第一个任务获取的结果传给第二个任务
          function(categories,cb){
            let dataArray = [];
            let dataItem = {};
            categories.forEach(function(cateItem,index){
              condition = {"deviceCate":cateItem._id};
              DeviceModel.count(condition, function (err, count) {
                if (err) {
                  console(err);
                } else {
                  dataItem = {"cateId":cateItem._id,"CateName":cateItem.CateName,"count":count};
                  dataArray.push(dataItem);
                  if(index == (categories.length-1)){
                    cb(null,dataArray);
                  }
                  //console.log(dataArray);
                }
              })
            });

          }
        ],
        function (err, result) {
          if (err) {
            cb(err);
          } else {
            cb(null, result);
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
        "data": results[1]
      })
    }
  });
}
module.exports = deviceController;
