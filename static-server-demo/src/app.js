const http = require('http')
const chalk = require('chalk')
const path = require('path')
const conf = require('./config/defaultConfig')
const route = require('./helper/route')

const server = http.createServer((req, res) => {
    const filePath = path.join(conf.root, req.url)  // 得到要访问的路径
    console.log(req)
    route(req, res, filePath)
})

server.listen(conf.port, conf.hostname, () => {
    const addr = `Server running at http://${conf.hostname}:${conf.port}/`
    console.log(`Server started at ${chalk.green(addr)}`)
})
