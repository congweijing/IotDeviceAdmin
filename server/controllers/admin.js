/**
 * users 控制器
 *
 * Created by jerry on 2017/11/2.
 */
const Admins = require('../data/admin');
let adminController = {};
let _Admins = Admins;

/**
 * 检查用户的登录状态
 * @param req
 * @param res
 * @param next
 */
adminController.checkLogin = function (req, res, next) {
  //用户已经登录
  if (req.session.userId) {
    next();
  }
  else {
    res.json({"errcode": 40001, "errmsg": "您还没有登录"});
  }
};

/**
 * 登录
 * @param req
 * @param res
 */
adminController.login = function (req, res) {
  let username = _.trim(req.query.username || req.body.username || '');
  let pwd = req.body.pwd;
  if (!username || !pwd) {
    return res.json({"errcode": 40002, "errmsg": "不合法的参数"});
  }

  // 通过用户名获取到用户信息
  let user = _.find(_Admins, function (u) {
    return u.username === username;
  });
  console.log('---_Admins----');
  console.log(_Admins);
  if (!user) {
    return res.json({"errcode": 40003, "errmsg": "用户不存在"});
  }
  if (user.password === pwd) {
    //设置session
    req.session.userId = user.id;

    return res.json({
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      name: user.name,
      email: user.email
    });
  } else {
    return res.json({"errcode": 40004, "errmsg": "密码错误"});
  }
};

/**
 * 退出登录
 * @param req
 * @param res
 */
adminController.logout = function (req, res) {
  req.session.destroy();
  res.json({"errcode": 0, "errmsg": "退出完成"});
};

/**
 * 修改个人部分信息
 * @param req
 * @param res
 */
adminController.profile = function (req, res) {
  let nickname = req.body.nickname;
  let email = req.body.email;
  let name  = req.body.name;
  let i = _.findIndex(_Admins, function (u) {
    return u.id === req.session.userId
  })
  if (i > -1) {
    _Admins[i].nickname = nickname;
    _Admins[i].email = email;
    _Admins[i].name = name;
    res.json({"errcode": 0, "errmsg": "修改成功"});
  } else {
    res.json({"errcode": 40009, "errmsg": "处理失败"});
  }
};

/**
 * 修改密码
 * @param req
 * @param res
 */
adminController.changepwd = function (req, res) {
  //TODO 未开发
};



module.exports = adminController;
