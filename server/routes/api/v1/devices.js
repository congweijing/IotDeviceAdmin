var express = require('express');
var router = express.Router();
var indexRouter = {};
var deviceController = require('../../../controllers/devices');

//获取所有设备
router.post('/findAllList',deviceController.findAllList);
//获取设备列表根据页码
router.post('/findList',deviceController.findList);
//新增一条设备信息
router.post('/add', deviceController.create);
//根据ID更新设备信息
router.put('/update/:id', deviceController.update);
//通过ID删除分类
router.delete('/delete/:id', deviceController.delete);
//批量删除
router.delete('/batch', deviceController.deleteBatch);
//根据deviceStatus获取设备列表
router.post('/findListByStatus',deviceController.findListByStatus);
//根据ids获取设备列表
router.post('/findListByIds',deviceController.findListByIds);
//根据ids批量更新设备的状态
router.post('/updateStatusBatch',deviceController.updateStatusBatch);
//获取设备总数和不同分类的设备数
router.post('/getDeviceTotal', deviceController.getDeviceTotal);


indexRouter.router = router;

module.exports = indexRouter;
