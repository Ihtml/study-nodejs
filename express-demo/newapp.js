const express = require('express')

// 本次HTTP请求的实例
const app = express()

app.use((req, res, next) => {
    console.log('请求开始');
    next()
})

app.use((req, res, next) => {
    console.log('处理cookie...');
    req.cookie = {
        userId: 'user1'
    }
    next()
})

app.use((req, res, next) => {
    console.log('处理POST data');
    setTimeout(() => {
        req.body = {
            a: 111,
            b: 222
        }
        next()
    });
})

// 只要是/api路由的请求都处理
app.use('/api', (req, res, next) => {
    console.log('处理 /api 路由');
    next()
})

// 只处理get请求
app.get('/api', (req, res, next) => {
    console.log('GET /api 路由');
    next()
})

// 只处理post请求
app.post('/api', (req, res, next) => {
    console.log('POST /api 路由');
    next()
})

// 模拟登录验证
function loginCheck(req, res, next) {
    setTimeout(() => {
        // console.log('模拟登陆失败')
        // res.json({
        //     errno: -1,
        //     msg: '登录失败'
        // })
        console.log('模拟登陆成功')
        next()
    })
}

app.get('/api/get-cookie',loginCheck, (req, res, next) => {
    console.log('get /api/get-cookie');
    res.json({
        msg: 'success',
        data: res.cookie
    })
})

app.post('/api/get-post-data',loginCheck, (req, res, next) => {
    console.log('post /api/get-post-data');
    res.json({
        msg: 'success',
        data: req.body
    })
})

app.use((req, res, next) => {
    console.log('处理 404')
    res.json({
        status: 404,
        msg: '404 not fount'
    })
})

app.use((req, res, next) => {
    console.log('request success');
    res.json({
        msg: 'success',
        status: 200
    })
})

app.listen(3003, () => {
    console.log('server is running on http://127.0.0.1:3003');
})

