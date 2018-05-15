var express = require('express');
var router = express.Router();
var indexRouter = {};



router.post('/getValue',function(req,res){
  var random = Math.random()*40;
  res.json({"value":random});
});


indexRouter.router = router;

module.exports = indexRouter;
