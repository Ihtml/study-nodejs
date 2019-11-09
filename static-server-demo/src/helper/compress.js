// 处理文件压缩
const {createGzip, createDeflate} = require('zlib')
/**
 * rs 资源
 * req 请求
 * res 响应
 */
module.exports = (rs, req, res) => {
    // 拿到请求中声明的支持
    const acceptEncoding = req.header['accecp-encoding']
    if (!acceptEncoding || !acceptEncoding.match(/\b(gzip|deflate)\b/)) {
        return rs
    } else if (acceptEncoding.match(/\bgzip\b/)) {
        res.setHeader('Content-Encoding', 'gzip')
        return rs.pipe(createGzip())
    } else if (acceptEncoding.match(/\bdeflate\b/)) {
        res.setHeader('Content-Encoding', 'deflate')
        return rs.pipe(createDeflate())
    }
}
