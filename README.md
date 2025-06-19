## Feature

- [x] 支持在运行时的`开发环境`和`本地生产环境`中转发`/uploads/xxx`路径到本地相应文件夹, 以便在远程部署中通过`Nginx`统一资源路径映射
- [x] 集成better-sqlite3
- [x] 集成TypeORM
- [ ] 实现仿MVC架构的数据库交互
- [ ] 精简dependencies

## 一些奇怪的问题

1. 如果sass模块在dependencies中, 会无法正确执行postinstall中electron-builder脚本, 放在devDependecies就没问题
