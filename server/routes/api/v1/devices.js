var express = require('express');
var router = express.Router();
var indexRouter = {};
var deviceController = require('../../../controllers/devices');


//获取分类列表
//router.post('/findList',categoryController.findList);
//新增一条分类
router.post('/add', deviceController.create);
//更新分类
//router.put('/update/:id', categoryController.update);

//通过ID删除分类
//router.delete('/delete/:id', categoryController.delete);


indexRouter.router = router;

module.exports = indexRouter;
