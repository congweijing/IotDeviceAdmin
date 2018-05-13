var express = require('express');
var router = express.Router();
var indexRouter = {};
var repairController = require('../../../controllers/repairs');


//获取列表
router.post('/findList',repairController.findList);
//新增一条信息
router.post('/add', repairController.create);
//根据ID更新信息
router.put('/update/:id', repairController.update);
//通过ID删除
router.delete('/delete/:id', repairController.delete);
//批量删除
//router.delete('/batch/:ids', deviceController.deleteBatch);
//router.delete('/batch', repairController.deleteBatch);

indexRouter.router = router;

module.exports = indexRouter;
