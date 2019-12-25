var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan'); // 生成日志

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const blogRouter = require('./routes/blog');
const userRouter = require('./routes/user');

var app = express(); // 每次客户端访问生成一个实例

// view engine setup 视图引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json()); // 将POST过来的JSON格式的数据，放到req.body中
app.use(express.urlencoded({ extended: false })); // 解析url格式的数据
app.use(cookieParser()); // 处理后 req.cookies就可以访问cookie
app.use(express.static(path.join(__dirname, 'public'))); // 提供静态资源服务

// 注册路由
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/blog', blogRouter);
app.use('/api/user', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {}; // 如果是开发坏境就显示err

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
