[中文](./README.md) | English

## TODO

- [x] Support forwarding `/uploads/xxx` paths to the corresponding local folder at runtime in both `development` and `local production` environments, so that `nginx` can uniformly map resource paths in remote deployment if necessary
- [x] Integrate `better-sqlite3`
- [x] Integrate `TypeORM`
- [x] Implement database interaction with a MVC style architecture
- [ ] Database migration – generate migration files and automatically reference them
- [ ] Remote update feature
- [ ] Simplify `dependencies`
- [ ] Disable debug mode in production environment

## Some Weird Issues

1. If the module `sass` is placed in `dependencies`, the `electron-builder` script in `postinstall` cannot execute properly; putting it in `devDependencies` works fine  
2. Because `IPC` in `electron` uses [Structured Clone Algorithm](https://www.electronjs.org/docs/latest/tutorial/ipc#object-serialization) to transfer data, it cannot serialize `Proxy` objects — you need to use `toRaw` to convert them into plain objects, or use `JSON.parse(JSON.stringify(obj))` as an alternative
