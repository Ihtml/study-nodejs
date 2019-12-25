var express = require('express');
var router = express.Router(); // 生成路由的实例

/* GET home page. */ 
// GET请求根目录的回调
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
