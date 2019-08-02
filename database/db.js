const fs = require("fs")
const Database = require('better-sqlite3')
const db = new Database('database/data.db', { verbose: console.log })
console.log("Conectado ao banco de dados SQLite database/data.db")

const migration = fs.readFileSync('database/migrate-schema.sql', 'utf8')
db.exec(migration)

process.on('exit', () =>{
    db.close()
    console.log("A conexão com o banco de dados SQLite database/data.db foi fechada.")
})
process.on("SIGINT", () => process.exit(128 + 2))

module.exports = db