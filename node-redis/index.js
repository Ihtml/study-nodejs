const redis = require('redis')
// 创建连接客户端
const redisClient = redis.createClient(6379, '127.0.0.1')
redisClient.on('error', err=> {
    console.log(err);
})

redisClient.set('key1', 'valur1', redis.print)
redisClient.get('key1', (err, val) => {
    if (err) {
        console.error(err);
        return
    }
    console.log('val ', val);

    // 退出
    redisClient.quit()
})
