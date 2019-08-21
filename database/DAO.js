const dbConnection = require("./db")

module.exports = class DAO {
    constructor(tabela) {
        this._connection = dbConnection
        this._tabela = tabela
    }

    async runQuery(sql, valores) {
        const statement = this._connection.prepare(sql)
        let info = undefined
        if (valores) {
            info = statement.run(valores)
        } else {
            info = statement.run()
        }
        return info
    }

    async getQuery(sql, valores) {
        const statement = this._connection.prepare(sql)
        let resultado = undefined
        if (valores) {
            resultado = statement.get(valores)
        } else {
            resultado = statement.get()
        }
        return resultado
    }

    async allQuery(sql, valores) {
        const statement = this._connection.prepare(sql)
        let resultado = undefined
        if (valores) {
            resultado = statement.all(valores)
        } else {
            resultado = statement.all()
        }
        return resultado
    }

    async criarSchema(attrs) {
        let sql = `CREATE TABLE IF NOT EXISTS ${this._tabela} (\n`

        let listaFKs = []

        const keys = Object.keys(attrs)
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i]

            sql += `${k} ${attrs[k].sql}`

            if (attrs[k].fk) {
                listaFKs.push(`FOREIGN KEY (${k}) REFERENCES ${attrs[k].fk.tabela}(${attrs[k].fk.attr})`)
            }

            if (i != keys.length - 1 || listaFKs.length > 0) {
                sql += `,\n`
            }
        }

        for (let i = 0; i < listaFKs.length; i++) {
            const l = listaFKs[i]

            sql += l

            if (i != listaFKs.length - 1) {
                sql += `,\n`
            }
        }

        sql += `\n);`

        return await this.runQuery(sql)
    }

    async adiciona(objeto) {
        let colunas = Object.keys(objeto).join(',')

        const valores = Object.values(objeto)

        const placeholders = valores.map(() => '?').join(',')

        const sql = `INSERT INTO ${this._tabela} (${colunas}) VALUES (${placeholders})`

        return this.runQuery(sql, valores)
    }

    async atualiza(objeto, query) {
        let colunas = Object.keys(objeto).join(',')

        let valores = Object.values(objeto)

        const colunasEPlaceholders = colunas.split(",").map(nome => `${nome} = ?`).join(",")

        const sql = `UPDATE ${this._tabela} SET ${colunasEPlaceholders}`

        const q = await this.gerarQuery(sql, query)
        q.valores = valores.concat(q.valores)
        return this.runQuery(q.sql, q.valores)
    }

    async deleta(query) {
        const q = await this.gerarQuery(`DELETE FROM ${this._tabela}`, query)
        return this.runQuery(q.sql, q.valores)
    }

    async busca(query) {
        const q = await this.gerarQuery(`SELECT * FROM ${this._tabela}`, query)
        return this.allQuery(q.sql, q.valores)
    }

    async gerarQuery(sql, query) {
        if (query) {
            const q = JSON.parse(JSON.stringify(query))

            let sqlOrdem = ""
            if (q.ordem && q.ordenarPor) {
                sqlOrdem = ` ORDER BY ${q.ordenarPor} ${q.ordem}`
                delete q.ordenarPor
                delete q.ordem
            }

            let sqlLimite = ""
            if (q.limite) {
                sqlLimite = ` LIMIT ${q.limite}`
                delete q.limite
            }

            let sqlWhere = ""
            const keys = Object.keys(q)
            if (keys.length > 0) {
                sqlWhere = ` WHERE ${keys.map(k => `${k} = ?`).join(" AND ")}`
            }

            return {
                sql: `${sql}${sqlWhere}${sqlOrdem}${sqlLimite}`,
                valores: Object.values(q)
            }
        }
        return {
            sql
        }
    }

}