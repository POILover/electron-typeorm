[中文](./README.md) | English

## TODO

- [x] Support forwarding `/uploads/xxx` paths to the corresponding local folder at runtime in both `development` and `local production` environments, so that `Nginx` can uniformly map resource paths in remote deployment
- [x] Integrate `better-sqlite3`
- [x] Integrate `TypeORM`
- [x] Implement database interaction with a pseudo-MVC architecture
- [ ] Database migration – generate migration files and automatically reference them
- [ ] Remote update
- [ ] Simplify `dependencies`
- [ ] Disable debug mode in production environment

## Some Weird Issues

1. If the `sass` module is placed under `dependencies`, the `electron-builder` script in `postinstall` will fail to execute properly; putting it under `devDependencies` works fine  
2. Because `IPC` communication in `electron` uses [Structured Clone Algorithm](https://www.electronjs.org/docs/latest/tutorial/ipc#object-serialization) to transfer data, it cannot serialize `Proxy` objects — you need to use `toRaw` to convert them into plain objects, or use `JSON.parse(JSON.stringify(obj))` as an alternative
