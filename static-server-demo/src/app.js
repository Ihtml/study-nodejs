const http = require('http')
const chalk = require('chalk')
const path = require('path')
const conf = require('../config/defaultConfig')
const fs = require('fs')

const server = http.createServer((req, res) => {
    const filePath = path.join(conf.root, req.url)  // 得到要访问的路径
    fs.stat(filePath, （err, stats) => {
      if(err){
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/plain')
        res.end(`${filePath} is not a directory or file`)
        return
      }
      if(stats.isFile()){
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/plain')
        // res.readFile(filePath, (err, data) => {
        //   res.end(data)
        // })
        fs.createReadStream(filePath).pipe(res)
      } else if (stats..isDirectory()) {
        fs.readdir(filePath, (err, files) => {
          res.statusCode = 200
          res.setHeader('Content-Type', 'text/plain')
          res.end(files.join('.'))
        })
      }
    })
})

server.listen(conf.port, conf.hostname, () => {
    const addr = `Server running at http://${conf.hostname}:${conf.port}/`
    console.log(`Server started at ${chalk.green(addr)}`)
})
