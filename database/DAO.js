const dbConnection = require("./db")

module.exports = class DAO {
    constructor(tabela) {
        this._connection = dbConnection
        this._tabela = tabela
    }

    async runQuery(sql, valores){
        const statement = this._connection.prepare(sql)
        const info = statement.run(valores)
        return info
    }

    async getQuery(sql, valores){
        const statement = this._connection.prepare(sql)
        const resultado = statement.get(valores)
        return resultado
    }

    async allQuery(sql, valores){
        const statement = this._connection.prepare(sql)
        let resultado = undefined
        if(valores){
            resultado = statement.all(valores)
        }
        else{
            resultado = statement.all()
        }
        return resultado
    }

    async adiciona(objeto) {
        objeto.dataAlteracao = await this.dataDeHoje()
        objeto.dataCriacao = await this.dataDeHoje()

        let colunas = Object.keys(objeto).join(',')
        
        const valores = Object.values(objeto)

        const placeholders = valores.map(() => '?').join(',')

        const sql = `INSERT INTO ${this._tabela} (${colunas}) VALUES (${placeholders})`
        
        return this.runQuery(sql, valores)
    }

    async atualiza(objeto, query){
        objeto.dataAlteracao = await this.dataDeHoje()

        let colunas = Object.keys(objeto).join(',')

        let valores = Object.values(objeto)

        const colunasEPlaceholders = colunas.split(",").map(nome => `${nome} = ?`).join(",")

        const sql = `UPDATE ${this._tabela} SET ${colunasEPlaceholders}`

        const q = await this.gerarQuery(sql, query)
        q.valores = valores.concat(q.valores)
        return this.runQuery(q.sql, q.valores)
    }

    async deleta(query){
        const q = await this.gerarQuery(`DELETE FROM ${this._tabela}`, query)
        return this.runQuery(q.sql, q.valores)
    }

    async busca(query){
        const q = await this.gerarQuery(`SELECT * FROM ${this._tabela}`, query)
        return this.allQuery(q.sql, q.valores)
    }

    async gerarQuery(sql, query){
        if(query && Object.keys(query).length > 0){
            const keys = Object.keys(query)
            let sql2 = ` WHERE ${keys.map(k => `${k} = ?`).join(" AND ")}`
            return {
                sql: `${sql}${sql2}`,
                valores: Object.values(query) 
            }
        }
        return {
            sql
        }
    }

    async dataDeHoje() {
        return new Date().toISOString()
    }

}