// Linux 标准输入输出概念
// process.stdin.pipe(process.stdout) // 控制台的输入输出到控制台

const http = require('http')
const fs = require('fs')
const path = require('path')

const server = http.createServer((req, res) => {
    // POST请求的内容，通过流的方式返回给客户端
    if (req.method === 'POST') {
        req.pipe(res) 
    }
    // 如果是GET请求, 将source.txt文件的内容，通过流的方式返回客户端
    if (req.method === 'GET') { 
        const fileName = path.resolve(__dirname, 'source.txt')
        const readStream = fs.createReadStream(fileName)
        readStream.pipe(res)
    }
})
server.listen(1001, () => {
    console.log('server is running http://localhost:1001');
})

// 通过Stream的方式拷贝文件内容
const fileName1 = path.resolve(__dirname, 'source.txt')
const fileName2 = path.resolve(__dirname, 'target.txt')
// 读取文件的Stream对象
const readStream = fs.createReadStream(fileName1)
// 写入文件的stream对象
const writeStream = fs.createWriteStream(fileName2)
// 通过pipi执行拷贝
readStream.pipe(writeStream)
readStream.on('data', chunk => {
    console.log(chunk.toString());
})
// 数据读取完成，即拷贝完成
readStream.on('end', () => {
    console.log("拷贝完成");
})
