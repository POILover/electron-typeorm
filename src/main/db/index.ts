import path from 'path'
import { DataSource } from 'typeorm'
// import { BetterSqlite3ConnectionOptions } from 'typeorm/driver/better-sqlite3/BetterSqlite3ConnectionOptions'

import { Photo } from './photo/photo.entities'
import { User } from './user/user.entities'
import { app } from 'electron'

// export const initDB = (database: string): DataSource => {
//   let basePath = path.join(app.getPath('userData'), `${database}.db`)
//   let options: BetterSqlite3ConnectionOptions = {
//     type: 'better-sqlite3',
//     entities: [User, Photo],
//     database: basePath,
//     synchronize: false,
//     migrations: [path.join(__dirname, 'migrations/*.ts')],
//     migrationsTableName: 'migrations',
//     prepareDatabase(db) {
//       db.pragma('foreign_keys = ON') // 启用外键约束, 外键的值必须在关联表中存在
//     }
//   }
//   return new DataSource(options)
// }
const isCLI = process.env.TYPEORM_CLI === 'true' // 判断是否是CLI环境
const databasePath = path.join(isCLI ? 'C:/Users/xxxx/AppData/Roaming/electron-typeorm' : app.getPath('userData'), 'mwddata.db')
export default new DataSource({
  type: 'better-sqlite3',
  entities: [User, Photo],
  database: databasePath,
  synchronize: false,
  migrations: [path.join(__dirname, 'migrations/*.ts')],
  migrationsTableName: 'migrations',
  prepareDatabase(db) {
    db.pragma('foreign_keys = ON') // 启用外键约束, 外键的值必须在关联表中存在
  }
})