const http = require('http')
const querystring = require('querystring')

const server = http.createServer((req, res) => {
    const method = req.method
    console.log(method); // 请求方式
    
    // 请求完整的 url
    const url = req.url  
    // 请求的路径
    const path = url.split('?')[0]
    console.log('path', path);
    
    // 请求的参数转换为对象
    const query = querystring.parse(url.split('?')[1]) 

    const resData = {
        method,
        url,
        path,
        query
    }
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain;charset=utf-8')
    let result = 'nothing'
    if (method === 'GET') {
         result = JSON.stringify(resData)
         console.log('res: ', result);
         res.end(result)
    }

    if (method === 'POST') {
        // 数据格式
        const contType = req.headers['content-type']
        console.log('req content-type: ', contType);
        result = Buffer.from([])
        // 当接收到post数据的时候会触发‘data’事件
        req.on('data', chunk => {
            result = Buffer.concat([result,chunk])// chunk本身是二进制的格式,要转字符串
        })
        // 接收完后触发end事件
        req.on('end', () => {
            // resData.postData = result
            result = result.toString()
            resData.postData = result
            console.log('res: ', result);
            res.end(JSON.stringify(resData))
        })
    }

})

server.listen(9999,'127.0.0.1', () => {
    console.log('Node server running at http://localhost:9999');
})