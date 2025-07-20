// scripts/create-migration.js
const { execSync } = require('child_process')

const name = process.argv[2]

if (!name) {
  console.error('❌ 请提供迁移名称，比如：npm run migrate:create AddUserTable')
  process.exit(1)
}

execSync(`npx typeorm migration:create ./src/main/db/migrations/${name}`, {
  stdio: 'inherit'
})
