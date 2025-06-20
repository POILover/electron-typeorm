import path from 'path'
import { DataSource } from 'typeorm'
import { BetterSqlite3ConnectionOptions } from 'typeorm/driver/better-sqlite3/BetterSqlite3ConnectionOptions'

import { Photo } from './photo/photo.entities'
import { User } from './user/user.entities'
import { app } from 'electron'

export const initDB = (database: string): DataSource => {
  let basePath = path.join(app.getPath('userData'), `${database}.db`)
  let options: BetterSqlite3ConnectionOptions = {
    type: 'better-sqlite3',
    entities: [User, Photo],
    database: basePath,
    synchronize: true,
    prepareDatabase(db) {
      db.pragma('foreign_keys = ON') // 启用外键约束, 外键的值必须在关联表中存在
    }
  }
  return new DataSource(options)
}
