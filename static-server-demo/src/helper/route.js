const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')
const promisify = require('util').promisify
const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)
const config = require('../config/defaultConfig')

const tplPath = path.join(__dirname, '../template/dir.tpl')
const source = fs.readFileSync(tplPath)  // 只会执行一次，以后就会用缓存
// fs读文件默认返回Buffer,需要转为字符串
const template = Handlebars.compile(source.toString())

module.exports = async function (req, res, filePath) {
  try {
    const stats = await stat(filePath)
    if(stats.isFile()){
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        // res.readFile(filePath, (err, data) => {
        //   res.end(data)
        // })
        fs.createReadStream(filePath, {encoding: 'utf-8'}).pipe(res)
    } else if (stats.isDirectory()) {
        const files = await readdir(filePath)
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/html')
        const dir = path.relative(config.root, filePath)
        const data = {
          title: path.basename(filePath),
          dir: dir ? `/${dir}` : '', // 如果访问根路径，dir返回空
          files
        }
        res.end(template(data))
    }
    } catch (err) {
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/plain')
        res.end(`${filePath} is not a directory or file`)
        return
    }
}
