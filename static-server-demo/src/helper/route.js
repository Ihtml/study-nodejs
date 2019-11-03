const fs = require('fs')
const promisify = require('util').promisify
const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)

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
        res.setHeader('Content-Type', 'text/plain')
        res.end(files.join('.'))
    }
    } catch (err) {
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/plain')
        res.end(`${filePath} is not a directory or file`)
        return
    }
}
