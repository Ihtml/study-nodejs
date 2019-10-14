## Node.js介绍
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

## Node.js的CommonJS规范

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



Node.js使用**global**作为全局对象；global有个**process**属性，代表当前执行的进程；