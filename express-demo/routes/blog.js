var express = require('express');
var router = express.Router(); 


// GET请求根目录的回调
router.get('/list', function(req, res, next) {
  res.json({
      status: 200,
      data: 'api/blog/list'
  });
});

router.get('/detail', function(req, res, next) {
    res.json({
        status: 200,
        data: 'api/blog/detail'
    });
  });

module.exports = router;
