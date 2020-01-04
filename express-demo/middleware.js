const http = require('http')
const slice = Array.prototype.slice

class Middleware {
    constructor() {
        // 存放全部中间件的列表
        this.routes = {
            all: [], // 存放用app.use注册的中间件
            get: [], // 存放app.get里的中间件
            post: [] // 存放app.post里的中间件
        }
    }

    register(path){
        const info = {}
        if (typeof path === 'string') {
            info.path = path
            // 从第二个参赛开始，转换为数组，存入stack
            info.stack = slice.call(arguments, 1)
        } else {
            info.path = '/'
            // 从第一个参赛开始，转换为数组，存入stack
            info.stack = slice.call(arguments, 0)
        }
        return info
    }

    use() {
        const info = this.register.apply(this, arguments)
        this.routes.all.push(info)
    }

    get() {
        const info = this.register.apply(this, arguments)
        this.routes.get.push(info)
    }

    post() {
        const info = this.register.apply(this, arguments)
        this.routes.post.push(info)
    }
    // 根据请求方式和路由，判断使用哪个中间件
    match(method, url) {
        let stack = []
        if (url === '/favicon.ico') {
            return stack
        }

        // 获取routes
        let curRoutes = []
        curRoutes = curRoutes.concat(this.routes.all)
        curRoutes = curRoutes.concat(this.routes[method])

        curRoutes.forEach((routeInfo) => {
            if (url.indexOf(routeInfo.path) === 0) { // 是否匹配路径
                stack = stack.concat(routeInfo.stack)
            }
        })
        return stack
    }

    // 核心的next机制, 递归执行next直到stack为空
    handle(req, res, stack) {
        const next = () => {
            // 每次调用next，拿到当前第一个匹配的中间件
            const middleware = stack.shift()
            if (middleware) {
                // 执行中间件函数
                middleware(req, res, next)
            }
        }
        next()
    }
    callback() {
        return (req, res) => {
            res.json = (data) => {
                res.setHeader('Content-type', 'application/json')
                res.end(
                    JSON.stringify(data)
                )
            }
            const url = req.url
            const method = req.method.toLowerCase()
            const resultList = this.match(method, url)
            this.handle(req, res, resultList)
        }
    }

    listen(...args) {
        const server = http.createServer(this.callback())
        server.listen(...args)
    }
}

// 工厂模式
module.exports = () => {
    return new Middleware()
}