// 处理文件压缩
const {createGzip, createDeflate} = require('zlib')
/**
 * rs 资源
 * req 请求
 * res 响应
 */
module.exports = (rs, req, res) => {
    // 拿到请求中声明支持的压缩方式
    const acceptEncoding = req.headers['accept-encoding']
    if (!acceptEncoding || !acceptEncoding.match(/\b(gzip|deflate)\b/)) {
        return rs
    } else if (acceptEncoding.match(/\bgzip\b/)) {
        // 告诉浏览器使用的哪种方式压缩
        res.setHeader('Content-Encoding', 'gzip')
        // 资源按gzip方式压缩
        return rs.pipe(createGzip())
    } else if (acceptEncoding.match(/\bdeflate\b/)) {
        res.setHeader('Content-Encoding', 'deflate')
        return rs.pipe(createDeflate())
    }
}
