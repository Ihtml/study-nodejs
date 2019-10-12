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

Node.js的模块有自己的作用域的原理是：模块在执行时，会被一个👇函数包裹

```js
(function (exports, require, module, __filename, __dirname) {
    // exports 对象，代表模块的输出，对外提供的接口和属性
    // require 一个函数，需要依赖其他模块时调用
    // module 代表当前模块本身
    // __filename 文件实际的路径
    // __dirname 文件所在文件夹路径
    // module content
})
```



**require**规则：

1. / 表示绝对路径，./表示相对于当前文件的路径
2. 支持js json node扩展名，不写依次尝试
3. 不写路径则认为是build-in模块或者各级node_modules内的第三方模块
4. module模块**第一次被加载的时候会执行**，**加载后会缓存**（第二次加载直接用放在内存中的结果）
5. 一旦出现某个模块被循环加载，就只输出已经执行的部分，还未执行的部分不会输出。

Node.js使用**global**作为全局对象；global有个**process**属性，代表当前执行的进程；