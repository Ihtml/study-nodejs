const yargs = require('yargs')
const Server = require('./app')

const argv = yargs
    .usage('static-server-demo [options]') // 提示
    .option('p', {
        alias: 'port',
        describe: '端口号',
        default: 3999
    })
    .option('h', {
        alias: 'hostname',
        describe: 'host',
        default: '127.0.0.1'
    })
    .option('d', {
        alias: 'root',
        describe: 'root path',
        default: process.cwd()
    })
    .version()
    .alias('v', 'version')
    .help()  // 根据option生成help信息
    .argv

const server = new Server(argv)
server.start()

// use
// node src/index.js --help   显示帮助信息
// node src/index.js -p 9999 | node src/index.js -p=9999
// node src/index.js --port 2333 | node src/index.js --port=2333
