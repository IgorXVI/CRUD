const fs = require("fs")
const Database = require('better-sqlite3')
const db = new Database('server/database/data.db', { verbose: console.log })
console.log("Conectado ao banco de dados SQLite server/database/data.db")

const migration = fs.readFileSync('server/database/migrate-schema.sql', 'utf8')
db.exec(migration)

process.on('exit', () =>{
    db.close()
    console.log("A conexão com o banco de dados SQLite server/database/data.db foi fechada.")
})
process.on("SIGINT", () => process.exit(128 + 2))

module.exports = db