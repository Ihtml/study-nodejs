var express = require('express');
var router = express.Router(); // 生成路由的实例


// POST请求根目录的回调
router.post('/login', function(req, res, next) {
  const {username, password} = req.body
  res.json({
      status: 200,
      data: `${username} login sucess`
  })
});

module.exports = router;
