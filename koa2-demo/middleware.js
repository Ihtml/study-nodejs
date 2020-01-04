const http = require('http')
const querystring = require('querystring')

function compose(middlewareList) {
    const fn = (ctx) => {
        const dispatch = () => {
            let middleWare = middlewareList.shift()
            middleWare = middleWare.bind(null) // 不需要使用this
            if (!middleWare) {
                return
            }
            try { 
                // 经过Promis.resolve()包裹后，无论middleware是async函数还是普通函数
                // 返回的都是promise对象，不会影响koa2整体的机制
                return Promise.resolve(  // 实现await next()
                    middleWare(ctx, dispatch)
                )
            } catch (error) {
                return Promise.reject(error)
            }
        }
        return dispatch()
    }
    return fn
}

class MiddleWare {
    constructor() {
        this.middlewareList = []
    }

    use(fnlist) {
        this.middlewareList.push(fnlist)
        return this // 支持链式调用 app.use().use().use()
    }

    createCtx(req, res) {
        const ctx = {
            req,
            res
        }
        const url = req.url
        req.path = url.split('?')[0]
        req.query = querystring.parse(url.split('?')[1])

        ctx.path = req.path
        ctx.query = req.query
        return ctx
    }

    handleRequest(ctx, fn) {
        return fn(ctx)
    }

    callback() {
        const fn = compose(this.middlewareList)
        return (req, res) => {
            const ctx = this.createCtx(req, res)
            // return fn(ctx)
            return this.handleRequest(ctx, fn)
        }
    }

    listen(...args) {
        const server = http.createServer(this.callback())
        server.listen(...args)
    }
}

module.exports = MiddleWare