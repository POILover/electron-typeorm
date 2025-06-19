## Feature

- [x] 支持在运行时的`开发环境`和`本地生产环境`中转发`/uploads/xxx`路径到本地相应文件夹, 以便在远程部署中通过`Nginx`统一资源路径映射
- [x] 集成better-sqlite3
- [x] 集成TypeORM
- [ ] 实现仿MVC架构的数据库交互
- [ ] 精简dependencies
- [ ] 取消生产环境的调试模式

## 一些奇怪的问题

1. 如果sass模块在dependencies中, 会无法正确执行postinstall中electron-builder脚本, 放在devDependecies就没问题
2. 因为`electron`中`IPC`通信过程传递数据采用的是[结构化克隆](https://www.electronjs.org/docs/latest/tutorial/ipc#object-serialization)方式, 它不能序列化`Proxy`数据, 要使用`toRaw`方法来将它转为普通对象, 也可以用`JSON.parse(JSON.stringfy(obj))`的方式
