var shortid = require("shortid");
var DeviceModel = require('../data/devices');
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
    }
  });
  res.json({"errcode": 0, "errmsg": "新增成功"})
};

module.exports = deviceController;
