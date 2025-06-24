import path from 'path'
import { DataSource } from 'typeorm'
import { Photo } from './photo/photo.entities'
import { User } from './user/user.entities'
import { app } from 'electron'
import { AddAliasToPhoto1750727572051 } from './migrations/1750727572051-AddAliasToPhoto'

const isCLI = process.env.TYPEORM_CLI === 'true'
const databasePath = path.join(isCLI ? 'C:/Users/xxxx/AppData/Roaming/electron-typeorm' : app.getPath('userData'), 'mwddata.db')
export default new DataSource({
  type: 'better-sqlite3',
  entities: [User, Photo],
  database: databasePath,
  synchronize: false,
  migrations:  [AddAliasToPhoto1750727572051], // TODO: auto generate & load migrations
  migrationsTableName: 'migrations',
  prepareDatabase(db) {
    db.pragma('foreign_keys = ON') // turn on foreign key constraints, the value of foreign keys must exist in the referenced table
  }
})