module.exports = (totalSize, req, res) => {
    const range = req.headers['range']
    if (!range) {
        return {code: 200}
    }

    // 如果请求头中带了range字段
    const sizes =  range.match(/bytes=(\d*)-(\d*)/)
    // sizes: [ 'bytes=0-100',
    //       '0',
    //       '100',
    //       index: 0,
    //       input: 'bytes=0-100',
    //       groups: undefined ]

    const end = sizes[2] ? parseInt(sizes[2]) : totalSize - 1
    const start = sizes[1] ? parseInt(sizes[1]) : totalSize - end

    if (start > end || start < 0 || end > totalSize) {
        return {code: 200}
    }
    res.setHeader('Accept-Ranges', 'bytes')
    res.setHeader('Content-Range', `bytes ${start}-${end}/${totalSize}`)
    res.setHeader('Content-Length', end - start)
    return {
        code: 206,
        start: start,
        end: end
    }
}
