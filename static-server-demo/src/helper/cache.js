const {cache} = require('../config/defaultConfig')

function refreshRes(stats, res) {
    const {maxAge, expires, cacheControl, lastModified, etag} = cache

    if (expires) {
        res.setHeader('Expires', (new Date(Date.now() + maxAge * 1000)).toUTCString());
    }

    if (cacheControl) {
        res.setHeader('Cache-Control', `public, max-age=${maxAge}`)
    }

    if (lastModified) {
        res.setHeader('Last-Modified', stats.mtime.toUTCString())
    }

    if (etag) {
    // mtime 需要转成字符串，否则在 windows 环境下会报错
        res.setHeader('ETag', `${stats.size}-${stats.mtime.toUTCString()}`)
    }
}

module.exports = function isFresh(stats, req, res) {
    // TODO
}
