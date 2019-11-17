const {cache} = require('../config/defaultConfig')

function refreshRes(stats, res) {
    const {maxAge, expires, cacheControl, lastModified, etag} = cache

    if (expires) {
        // 以服务器当前时间加上十分钟，返回给客户端
        res.setHeader('Expires', (new Date(Date.now() + maxAge * 1000)).toUTCString())
    }

    if (cacheControl) {
        // max-age返回一个相对时间
        res.setHeader('Cache-Control', `public, max-age=${maxAge}`)
    }

    if (lastModified) {
        // 返回文件最近修改时间
        res.setHeader('Last-Modified', stats.mtime.toUTCString())
    }

    if (etag) {
    // mtime 需要转成字符串，否则在 windows 环境下会报错
    // 用文件大小结合最近修改时间，生成文件的etag
        res.setHeader('ETag', `${stats.size}-${stats.mtime.toUTCString().replace(/,/g, '')}`)
    }
}

module.exports = function isFresh(stats, req, res) {
    refreshRes(stats, res)

    const lastModified = req.headers['if-modified-since']
    const etag = req.headers['if-none-match']

    if (!lastModified && !etag) {
        return false
    }

    if (lastModified && lastModified !== res.getHeader('Last-Modified')) {
        return false
    }

    if (etag && etag !== res.getHeader('ETag')) {
        return false
    }

    return true
}
