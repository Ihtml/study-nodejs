## 一、Node.js介绍
>Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient. Node.js' package ecosystem, npm, is the largest ecosystem of open source libraries in the world.		

Node.js® 是一个基于 Chrome V8 引擎 的 JavaScript 运行时。它不是一门语言，它可以让javascript在服务器端运行,Node.js不能使用javascript的DOM和BOM，但提供了http的核心库。       

Node.js还提供了**事件驱动**和**非阻塞**的I/O模型。**阻塞**：指I/O时进程休眠等待I/O完成后进行下一步。**非阻塞**：I/O时函数立即返回，进程不等待I/O完成。**事件驱动**：指I/O等异步操作后结束的通知，使用的是观察者模式。

为什么偏爱Node.js:		

1. 使前端职责范围变大，统一开发体验。
2. 在处理**高并发**、**I/O密集场景**（文件操作、网络操作、数据库操作）性能优势明显。web常见的场景为：静态资源读取，数据库操作、渲染页面；可见web是典型I/O密集场景。

Node.js常用场景：

* Web Server
* 本地代码构建（webpack、babel）
* 开发小工具

## 二、Node.js的CommonJS规范

Node.js使用**CommonJS**规范作为模块标准。

CommonJS规范的规定：

1. 每个文件是一个模块，有自己的作用域。
2. 在模块内部**module**变量代表模块本身。
3. **module.exports**属性代表模块对外接口。

Node.js的模块有自己的作用域的原理是：模块在执行时，会Node.js包裹一个函数。

```js
const exports = module.exports
(function (exports, require, module, __filename, __dirname) {
    // exports 对象，代表模块的输出，对外提供的接口和属性
    // require 一个函数，需要依赖其他模块时调用
    // module 代表当前模块本身
    // __filename 文件实际的路径
    // __dirname 文件所在文件夹路径
    // module content code
})
```

**module.exports与exports的区别:**

exports就相当于module.exports的快捷方式，**不可以改变exports的指向**。比如`exports = {test: 123};`是错误的用法，**CommonJS中模块对外的输出永远是module.exports,**修改exports的指向后就不生效了。这种情况应该用module.exports.

```
exports.test = 123; // 没问题，exports依然指向module.exports
exports = {test: 123}; // 会改变exports的指向{test: 123}对象
module.exports = {test: 123}; // 没问题
```

**require**规则：

1. / 表示绝对路径，./表示相对于当前文件的路径
2. 支持js json node扩展名，不写依次尝试
3. 不写路径则认为是build-in模块或者各级node_modules内的第三方模块
4. module模块**第一次被加载的时候会执行**，**加载后会缓存**（第二次加载直接用放在内存中的结果）
5. 一旦出现某个模块被**循环加载**，就只输出已经执行的部分，还未执行的部分不会输出。
6. 引用系统自带模块不用写路径，比如引用fs模块（file system）,只需`const fs = require('fs')`；引用第三方模块，需要先通过npm安装，然后就直接通过文件名引用。
7. 通过npm下载的第三方模块，会放在node_modules文件夹内，同时模块依赖的其他模块也会被下载到这个文件夹下。当通过模块名引用模块时，如果自带模块里没有，就会到node_modules文件夹里找，如果再找不到就会层层向上找直到根目录。现在Node做了优化，第三方模块会平级地放到node_modules中。通过`npm roo -g`查看全局模块安装目录，在`/usr/local/lib/node_modules`

## 三、Node.js的全局对象

**global全局对象：**

javascript在浏览器运行的时候，会把全局的属性和方法挂载到**window**对象中。而Node.js使用**global**作为全局对象；

global带有的一些常用的属性和方法：

* CommonJS，在Node.js中能直接用CommonJS因为它挂载在全局中
* Buffer（二进制的处理）、process（进程相关）、console
* timer
* [setImmediate(callback[, ...args])](http://nodejs.cn/api/timers.html#timers_setimmediate_callback_args),在当前回合的 [Node.js 事件循环](http://nodejs.cn/s/eeiBdr)结束时调用的函数

**process：**

global的**process**属性，代表当前执行的进程，它有如下常见属性：

* [process.argv](http://nodejs.cn/api/process.html#process_process_argv)，返回一个数组，其中包含当启动 Node.js 进程时传入的命令行参数,可以在外部传入文件的时候传入自定义的参数。

* [process.argv0](http://nodejs.cn/api/process.html#process_process_argv0), 保存当 Node.js 启动时传入的 `argv[0]` 的原始值的只读副本

* [process.execArgv](http://nodejs.cn/api/process.html#process_process_execargv), 返回当 Node.js 进程被启动时，Node.js 特定的命令行选项。` node --harmony script.js —version`返回`['--harmony']`

* [process.execPath](http://nodejs.cn/api/process.html#process_process_execpath), 返回启动 Node.js 进程的可执行文件的绝对路径名。`'/usr/local/bin/node'`

* [process.env](http://nodejs.cn/api/process.html#process_process_env) , 返回包含用户环境的对象。

  ```
  {
    TERM: 'xterm-256color',
    SHELL: '/usr/local/bin/bash',
    USER: 'maciej',
    PATH: '~/.bin/:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin',
    PWD: '/Users/maciej',
    EDITOR: 'vim',
    SHLVL: '1',
    HOME: '/Users/maciej',
    LOGNAME: 'maciej',
    _: '/usr/local/bin/node'
  }
  ```

* [process.cwd()](http://nodejs.cn/api/process.html#process_process_cwd),返回 Node.js 进程的当前工作目录。相当于`pwd`命令。

  ```js
  console.log(`当前工作目录是: ${process.cwd()}`);
  ```


## 四、Node.js的调试

Node.js有多种调试方式，可以参考官方文档[调试指南](https://nodejs.org/zh-cn/docs/guides/debugging-getting-started/)，常用的是通过Inspector调试，和借助VScode编辑器调试。

如果是使用Chromium 内核的浏览器打开 `chrome://inspect`。点击配置按钮确保你的目标宿主和端口号列入其中。在命令行里启动文件的时候加上`--inspect-brk`,例如：`node --inspect-brk test.js`会让test.js在入口处停住。现在浏览器窗口里会有Remote Target,点击inspect就进入调试环境。

如果使用VScode编辑器开发，点击左侧侧边栏调试按钮，再点击开始调试按钮就可以开始调试。

## 五、Node.js常见API

#### 1, Path

[path](http://nodejs.cn/api/path.html)是用来处理和路径有关的模块。它是内置模块所有可以直接引用:

```
const path = require('path');
```

[path.basename(path[, ext])](http://nodejs.cn/api/path.html#path_path_basename_path_ext), 返回 `path` 的最后一部分

```
path.basename('/foo/bar/baz/asdf/quux.html');
// 返回: 'quux.html'
path.basename('/foo/bar/baz/asdf/quux.html', '.html');
// 返回: 'quux'
```

[path.delimiter](http://nodejs.cn/api/path.html#path_path_delimiter),返回平台特定路径定界符，`;` 用于 Windows，`:` 用于 POSIX

```
console.log(process.env.PATH);
// 打印: 'C:\Windows\system32;C:\Windows;C:\Program Files\node\'

process.env.PATH.split(path.delimiter);
// 返回: ['C:\\Windows\\system32', 'C:\\Windows', 'C:\\Program Files\\node\\']
```

[path.dirname(path)](http://nodejs.cn/api/path.html#path_path_dirname_path),返回 `path` 的目录名,如果 `path` 不是字符串，则抛出 [`TypeError`](http://nodejs.cn/s/Z7Lqyj)。

```
path.dirname('/foo/bar/baz/asdf/quux');
// 返回: '/foo/bar/baz/asdf'
```

[path.extname(path)](http://nodejs.cn/api/path.html#path_path_extname_path),返回 `path` 的扩展名，从最后一次出现 `.`（句点）字符到 `path` 最后一部分的字符串结束。 如果在 `path` 的最后一部分中没有 `.` ，或者如果 `path` 的基本名称除了第一个字符以外没有 `.`，则返回空字符串。

```
path.extname('index.html');
// 返回: '.html'
path.extname('.index');
// 返回: ''
```

[path.parse(path)](http://nodejs.cn/api/path.html#path_path_parse_path),返回一个对象，其属性表示 `path` 的重要元素。

```
path.parse('/home/user/dir/file.txt');
// 返回:
// { root: '/',
//   dir: '/home/user/dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' }
```

[path.format(pathObject)](http://nodejs.cn/api/path.html#path_path_format_pathobject),从对象返回路径字符串。 与 [`path.parse()`](http://nodejs.cn/s/pqufSi) 相反。

```
path.format({
  dir: 'C:\\path\\dir',
  base: 'file.txt'
});
// 返回: 'C:\\path\\dir\\file.txt'
```

[path.isAbsolute(path)](http://nodejs.cn/api/path.html#path_path_isabsolute_path),检测 `path` 是否为绝对路径。如果给定的 `path` 是零长度字符串，则返回 `false`。如果 `path` 不是字符串，则抛出 [`TypeError`](http://nodejs.cn/s/Z7Lqyj)

```
path.isAbsolute('/foo/bar'); // true
path.isAbsolute('/baz/..');  // true
path.isAbsolute('qux/');     // false
path.isAbsolute('.');        // false
```

[path.join([...paths])](http://nodejs.cn/api/path.html#path_path_join_paths),使用平台特定的分隔符作为定界符将所有给定的 `path` 片段连接在一起，然后规范化生成的路径。零长度的 `path` 片段会被忽略。 如果连接的路径字符串是零长度的字符串，则返回 `'.'`，表示当前工作目录。

```
path.join('/foo', 'bar', 'baz/asdf', 'quux', '..');
// 返回: '/foo/bar/baz/asdf'

path.join('foo', {}, 'bar');
// 抛出 'TypeError: Path must be a string. Received {}'
```

[path.normalize(path)](http://nodejs.cn/api/path.html#path_path_normalize_path),规范化给定的 `path`，解析 `'..'` 和 `'.'` 片段。

```
path.normalize('/foo/bar//baz/asdf/quux/..');
// 在 POSIX 上返回: '/foo/bar/baz/asdf'
path.normalize('C:\\temp\\\\foo\\bar\\..\\');
// 在 Windows 上返回: 'C:\\temp\\foo\\'
```

[path.resolve([...paths])](http://nodejs.cn/api/path.html#path_path_resolve_paths),将路径或路径片段的序列解析为绝对路径。给定的路径序列**从右到左进行处理**，每个后续的 `path` 前置，直到构造出一个绝对路径。如果在处理完所有给定的 `path` 片段之后还未生成绝对路径，则再加上当前工作目录。如果没有传入 `path` 片段，则 `path.resolve()` 将返回当前工作目录的绝对路径。

```
path.resolve('/foo/bar', './baz');
// 返回: '/foo/bar/baz'
path.resolve('/foo/bar', '/tmp/file/');
// 返回: '/tmp/file'
path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif');
// 如果当前工作目录是 /home/myself/node，
// 则返回 '/home/myself/node/wwwroot/static_files/gif/image.gif'
```

[path.sep](http://nodejs.cn/api/path.html#path_path_sep),提供平台特定的路径片段分隔符：Windows 上是 `\`。POSIX 上是 `/`。

```
'foo/bar/baz'.split(path.sep);
// 在 POSIX 上返回: ['foo', 'bar', 'baz']
'foo\\bar\\baz'.split(path.sep);
// 在 Windows 上返回: ['foo', 'bar', 'baz']
```

另外：

* __dirname、__**filename**总是返回文件所在绝对路径

* **process.cwd()**总是返回执行node命令所在文件夹

* **"./"**在require方法中总是相当于当前文件所在的文件夹，而在其它地方和process.cwd()一页，相当于node命令启动时的文件夹。

#### 2, Buffer(缓冲器)

在ES6引入 [`TypedArray`](http://nodejs.cn/s/oh3CkV) 之前，JavaScript 语言没有用于读取或操作二进制数据流的机制, [Buffer](http://nodejs.cn/api/buffer.html#buffer_buffer) 类是作为 Node.js API 的一部分引入的，用于在 TCP 流、文件系统操作、以及其他上下文中与八位字节流进行交互。

Buffer用于处理二进制数据流，实例类似整数数组，大小固定。Buffer所用的内存是C++代码在V8堆外分配物理内存。Node.js中的代码不纯粹是javascript,还有一部分C++代码。

```
// 创建一个长度为 10、且用零填充的 Buffer。
const buf1 = Buffer.alloc(10);
// 创建一个长度为 10、且用 0x1 填充的 Buffer。 
const buf2 = Buffer.alloc(10, 1);
// 创建一个包含 [0x1, 0x2, 0x3] 的 Buffer。
const buf4 = Buffer.from([1, 2, 3]);
// 创建一个包含 UTF-8 字节 [0x74, 0xc3, 0xa9, 0x73, 0x74] 的 Buffer。
const buf5 = Buffer.from('tést');
```

[Buffer.byteLength(string[, encoding])](http://nodejs.cn/api/buffer.html#buffer_class_method_buffer_bytelength_string_encoding)返回字符串的实际字节长度。

[Buffer.isBuffer(obj)](http://nodejs.cn/api/buffer.html#buffer_class_method_buffer_isbuffer_obj)判断一个对象是不是Buffer对象，是返回true，不是返回false。

[Buffer.concat(list[, totalLength])](http://nodejs.cn/api/buffer.html#buffer_class_method_buffer_concat_list_totallength),返回一个合并了 `list` 中所有 `Buffer` 实例的新 `Buffer`

Buffer实例的方法：

[buf.length](http://nodejs.cn/api/buffer.html#buffer_buf_length),返回内存中分配给 `buf` 的字节数。

[buf.toString()](http://nodejs.cn/api/buffer.html#buffer_buf_tostring_encoding_start_end),根据 `encoding` 指定的字符编码将 `buf` 解码成字符串。 传入 `start` 和 `end` 可以只解码 `buf` 的子集。

[buf.fill()](http://nodejs.cn/api/buffer.html#buffer_buf_fill_value_offset_end_encoding),用指定的 `value` 填充 `buf`。 

[buf.equals()](),如果 `buf` 与 `otherBuffer` 具有完全相同的字节，则返回 `true`，否则返回 `false`。

[buf.indexOf()](),`buf` 中首次出现 `value` 的索引，如果 `buf` 没包含 `value` 则返回 `-1`。

[buf.copy()](),拷贝 `buf` 中某个区域的数据到 `target` 中的某个区域，即使 `target` 的内存区域与 `buf` 的重叠。

#### 3，[events事件](http://nodejs.cn/api/events.html)

在Node.js中，所有能触发事件的对象都是EventEmitter的实例，这些对象有一个 `eventEmitter.on()` 函数，用于将一个或多个函数绑定到命名事件上。当 `EventEmitter` 对象触发一个事件时，所有绑定在该事件上的函数都会被同步地调用。 被调用的监听器返回的任何值都将会被忽略并丢弃。

```
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('触发事件');
});
myEmitter.emit('event');
```

`eventEmitter.emit()` 方法可以传任意数量的参数到监听器函数。 当监听器函数被调用时， `this` 关键词会被指向监听器所绑定的 `EventEmitter` 实例。当使用 ES6 的箭头函数作为监听器，this` 关键词不会指向 `EventEmitter实例：

```
const myEmitter = new MyEmitter();
myEmitter.on('event', function(a, b) {
  console.log(a, b, this, this === myEmitter);
  // 打印:
  //   a b MyEmitter {
  //     domain: null,
  //     _events: { event: [Function] },
  //     _eventsCount: 1,
  //     _maxListeners: undefined } true
});
myEmitter.emit('event', 'a', 'b');
myEmitter.on('event', (a, b) => {
  console.log(a, b, this);
  // 打印: a b {}
});
myEmitter.emit('event', 'a', 'b');
```

如果事件只想被触发一次，可以用[eventEmitter.on](http://nodejs.cn/api/events.html#events_handling_events_only_once),当事件被触发时，监听器会被注销，然后再调用。

移除事件监听：[emitter.removeListener(eventName, listener)](http://nodejs.cn/api/events.html#events_emitter_removelistener_eventname_listener),从名为 `eventName` 的事件的监听器数组中移除指定的 `listener`。

```
const callback = (stream) => {
  console.log('已连接');
};
server.on('connection', callback);
// ...
server.removeListener('connection', callback);
```

#### 4，[fs(文件系统)](http://nodejs.cn/api/fs.html)

`fs` 模块提供了一个 API，用于以模仿标准 POSIX 函数的方式与文件系统进行交互。所有文件系统操作都具有同步和异步的形式, 建议使用这些调用的异步版本。 同步的版本将阻塞整个进程，直到它们完成（停止所有连接）。

异步的形式总是将完成回调作为其最后一个参数。 传给完成回调的参数取决于具体方法，但第一个参数始终预留用于异常。 如果操作成功完成，则第一个参数将为 `null` 或 `undefined`。

```
const fs = require('fs');
fs.unlink('/tmp/hello','utf-8', (err) => { // 删文件
  if (err) throw err;
  console.log('已成功删除 /tmp/hello');
});
const data = fs.readFileSync('./test.js', 'utf8') // 同步操作
console.log(data)
```

读文件：[fs.readFile(path[, options], callback)](http://nodejs.cn/api/fs.html#fs_fs_readfile_path_options_callback)异步地读取文件的全部内容。

```
fs.readFile('/etc/passwd', (err, data) => {
  if (err) throw err;
  console.log(data);
});
```

写文件：[fs.writeFile(file, data[, options], callback)](http://nodejs.cn/api/fs.html#fs_fs_writefile_file_data_options_callback)

```
const fs = require('fs')
fs.writeFile('./test', 'This is test!', {
	encoding: 'utf8'
}, err => {
	if (err) throw err;
	console.log('done!')
})
```

文件信息：[fs.Stats 类](http://nodejs.cn/api/fs.html#fs_class_fs_stats)

```
const fs = require('fs')
fs.stat('./test', (err, stats)=> {
	if (err) throw err; // 文件不存在
	console.log('stats.isFile()') // 判断是不是文件
	console.log('stats.isDirectory') // 判断是不是文件夹
})
```

文件重命名：[fs.rename(oldPath, newPath, callback)](http://nodejs.cn/api/fs.html#fs_fs_rename_oldpath_newpath_callback)

```
fs.rename('旧文件.txt', '新文件.txt', (err) => {
  if (err) throw err;
  console.log('重命名完成');
});
```

读文件夹：[fs.readdir(path[, options], callback)](http://nodejs.cn/api/fs.html#fs_fs_writefile_file_data_options_callback),异步的读取目录的内容。

创建文件夹：[fs.mkdir(path[, options], callback)](http://nodejs.cn/api/fs.html#fs_fs_mkdir_path_options_callback),异步地创建目录。

删除文件夹：[fs.rmdir(path[, options], callback)](http://nodejs.cn/api/fs.html#fs_fs_rmdir_path_options_callback),在文件（而不是目录）上使用 `fs.rmdir()` 会导致错误。

**监视文件变化**：

[fs.watch(filename[, options][, listener])](http://nodejs.cn/api/fs.html#fs_fs_watch_filename_options_listener)

```
fs.watch('./', {
	recursive: true  // 是否递归检查子文件
}, (eventType, filename) => {
	console.log(eventType, filename)  // eventType:change、rename
})
```

[fs.ReadStream](http://nodejs.cn/api/fs.html#fs_class_fs_readstream)

stream可以理解为有方向的数据，像水流一样不断产生和被消耗

```
const fs = require('fs')
const rs = fs.createReadStream('./readStream.js') // 创建流的数据
rs.pipe(process.stdout) // 定义方向,输出到控制台

const ws = fs.createWriteStream('./test.txt') // 创建可写流
const timer = setInterval(() => {
	const num = parseInt(Math.random() * 10)
	if (num < 7) {
		ws.write(num + '')  // 只能读字符串或Buffer，数字要转成字符串
	} else {
		clearInterval(tid)
		ws.end()
	}
}, 200)
ws.on('finish', () => {
	console.log('write finish')
})
```

