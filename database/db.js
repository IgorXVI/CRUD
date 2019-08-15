const log = require('log-to-file')
const fs = require("fs")
const Database = require('better-sqlite3')

const db = new Database('data.db',  { verbose: log })
log("Conectado ao banco de dados SQLite data.db")
console.log("Conectado ao banco de dados SQLite data.db")

const migration = fs.readFileSync('database/migrate-schema.sql', 'utf8')
db.exec(migration)

process.on('exit', () =>{
    db.close()
    log("A conexão com o banco de dados SQLite data.db foi fechada.")
    console.log("A conexão com o banco de dados SQLite data.db foi fechada.")
})
process.on("SIGINT", () => process.exit(128 + 2))

module.exports = db