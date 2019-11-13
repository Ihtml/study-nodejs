const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')
const promisify = require('util').promisify
const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)
const config = require('../config/defaultConfig')
const mime = require('./mime')
const compress = require('./compress')
const range = require('./range');

const tplPath = path.join(__dirname, '../template/dir.tpl')
const source = fs.readFileSync(tplPath)  // 只会执行一次，以后就会用缓存
// fs读文件默认返回Buffer,需要转为字符串
const template = Handlebars.compile(source.toString())

module.exports = async function (req, res, filePath) {
  try {
    const stats = await stat(filePath)
    if(stats.isFile()){
        const contenType = mime(filePath) + ';charset=utf-8'
        res.setHeader('Content-Type', contenType)
        // fs.createReadStream(filePath, {encoding: 'utf-8'}).pipe(res)
        let rs
        const {code, start, end} = range(stats.size, req, res)
        // curl -r 0-100 -i http://127.0.0.1:3999/.editorcon 验证
        if (code === 200) {
          res.statusCode = 200;
          rs = fs.createReadStream(filePath);
        } else {
          res.statusCode = 206;
          rs = fs.createReadStream(filePath, {start, end});
        }
        if (filePath.match(config.compress)){
          rs = compress(rs, req, res) // 压缩后的文件
        }
        rs.pipe(res)
    } else if (stats.isDirectory()) {
        const files = await readdir(filePath)
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/html')
        const dir = path.relative(config.root, filePath)
        const data = {
          title: path.basename(filePath),
          dir: dir ? `/${dir}` : '', // 如果访问根路径，dir返回空
          files: files.map(file => {
            return {
              file,
              icon: mime(file)
            }
          })
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
