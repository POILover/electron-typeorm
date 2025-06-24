中文 | [English](./README.en.md)

## TODO

- [x] 支持在运行时的`开发环境`和`本地生产环境`中转发`/uploads/xxx`路径到本地相应文件夹, 以便未来在远程部署中可以通过`nginx`统一资源路径映射
- [x] 集成`better-sqlite3`
- [x] 集成`TypeORM`
- [x] 实现仿MVC架构的数据库交互
- [ ] 数据库迁移 - 生成迁移文件并自动引用
- [ ] 远程更新
- [ ] 精简`dependencies`
- [ ] 取消生产环境的调试模式

## 一些奇怪的问题

1. 如果`sass`模块在`dependencies`中, 会无法正确执行`postinstall`中的`electron-builder`脚本, 放在`devDependecies`就没问题
2. 因为`electron`中`IPC`通信过程传递数据采用的是[结构化克隆](https://www.electronjs.org/docs/latest/tutorial/ipc#object-serialization)方式, 它不能序列化`Proxy`数据, 要使用`toRaw`方法来将它转为普通对象, 也可以用`JSON.parse(JSON.stringfy(obj))`的方式
