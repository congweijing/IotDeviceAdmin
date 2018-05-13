var express = require('express');
var router = express.Router();
var indexRouter = {};
var userController = require('../../../controllers/users');


//获取用户列表
router.post('/findList',userController.findList);
//新增一条用户信息
router.post('/add', userController.create);
//根据ID更新用户信息
router.put('/update/:id', userController.update);
//通过ID删除用户
router.delete('/delete/:id', userController.delete);
//批量删除
//router.delete('/batch/:ids', deviceController.deleteBatch);
router.delete('/batch', userController.deleteBatch);

indexRouter.router = router;

module.exports = indexRouter;
