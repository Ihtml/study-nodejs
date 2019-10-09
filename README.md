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