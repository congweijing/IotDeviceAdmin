/**
 * Created by jerry on 2017/11/13.
 * users相关路由
 * 采用 restful api 风格
 */

var express = require('express');
var router = express.Router();
var indexRouter = {};
var adminController = require('../../../controllers/admin');

//用户登录
router.post('/login', adminController.login);
//用户退出
router.get('/logout', adminController.logout);

//先检查登录
router.use(adminController.checkLogin);

//更新个人部分信息
router.patch('/profile', adminController.profile);
//用户修改个人密码
router.patch('/changepwd', adminController.changepwd);

//返回user的集合
router.get('/', adminController.find);
//
// //返回指定的user
// router.get('/:id', adminController.findById);
//h
// //创建user
// router.post('/', adminController.create);
//
// //更新user全部信息
// router.put('/:id', adminController.update);
//
// //更新user部分信息
// router.patch('/:id', adminController.patch);
//
// //删除指定的user
// router.delete('/:id', adminController.delete);

indexRouter.router = router;

module.exports = indexRouter;

