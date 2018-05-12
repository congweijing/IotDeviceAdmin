var express = require('express');
var router = express.Router();
var indexRouter = {};
var deviceController = require('../../../controllers/devices');


//获取设备列表
router.post('/findList',deviceController.findList);
//新增一条设备信息
router.post('/add', deviceController.create);
//根据ID更新设备信息
router.put('/update/:id', deviceController.update);
//通过ID删除分类
router.delete('/delete/:id', deviceController.delete);
//批量删除
//router.delete('/batch/:ids', deviceController.deleteBatch);
router.delete('/batch', deviceController.deleteBatch);

indexRouter.router = router;

module.exports = indexRouter;
