const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')
const promisify = require('util').promisify
const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)
const mime = require('./mime')
const compress = require('./compress')
const range = require('./range')
const isFresh = require('./cache')

const tplPath = path.join(__dirname, '../template/dir.tpl')
const source = fs.readFileSync(tplPath)  // 只会执行一次，以后就会用缓存
// fs读文件默认返回Buffer,需要转为字符串
const template = Handlebars.compile(source.toString())

module.exports = async function (req, res, filePath, config) {
  try {
    const stats = await stat(filePath)

    // 如果是文件
    if (stats.isFile()) {
      // 判断文件类型，返回对应的Content-Type
      const contenType = mime(filePath) + ';charset=utf-8'
      res.setHeader('Content-Type', contenType)

      // 如果请求缓存命中，则返回304
      if (isFresh(stats, req, res)) {
        res.statusCode = 304
        res.end()
        return
      }

      // fs.createReadStream(filePath, {encoding: 'utf-8'}).pipe(res)
      let rs
      const { code, start, end } = range(stats.size, req, res)
      // curl -r 0-100 -i http://127.0.0.1:3999/.editorcon 验证请求范围

      if (code === 200) {
        res.statusCode = 200;
        rs = fs.createReadStream(filePath);
      } else {
        res.statusCode = 206;
        rs = fs.createReadStream(filePath, { start, end });
      }

      //  处理压缩
      if (filePath.match(config.compress)) {
        rs = compress(rs, req, res) // 压缩后的文件
      }
      rs.pipe(res)

      // 如果是文件夹，返回文件夹里各文件的链接
    } else if (stats.isDirectory()) {
      const files = await readdir(filePath)
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/html')
      const dir = path.relative(config.root, filePath) // return: 'src‘ || ’‘
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
