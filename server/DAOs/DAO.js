const dbConnection = require("../database/db")

module.exports = class DAO {
    constructor(tabela) {
        this._connection = dbConnection
        this._tabela = tabela
    }

    runQuery(sql, valores){
        const statement = this._connection.prepare(sql)
        const info = statement.run(valores)
        return info
    }

    getQuery(sql, valores){
        const statement = this._connection.prepare(sql)
        const resultado = statement.get(valores)
        return resultado
    }

    allQuery(sql, valores){
        const statement = this._connection.prepare(sql)
        let resultado = undefined
        if(valores){
            resultado = statement.all(valores)
        }
        else{
            resultado = statement.all(valores)
        }
        return resultado
    }

    async adiciona(objeto, colunas) {
        const valores = Object.values(objeto)

        const placeholders = valores.map((valor) => '?').join(',')

        const sql = `INSERT INTO ${this._tabela} (${colunas}) VALUES (${placeholders})`
        
        return this.runQuery(sql, valores)
    }

    async atualizaPorColuna(objeto, colunaValor, colunaNome, colunas) {
        const valores = Object.values(objeto)
        valores.push(colunaValor)

        const colunasEPlaceholders = colunas.split(",").map(nome => `${nome} = ?`).join(",")

        const sql = `UPDATE ${this._tabela} SET ${colunasEPlaceholders} WHERE ${colunaNome} = ?`

        return this.runQuery(sql, valores)
    }

    async deletaPorColuna(colunaValor, colunaNome) {
        const sql = `DELETE FROM ${this._tabela} WHERE ${colunaNome} = ?`

        return this.runQuery(sql, colunaValor)
    }

    async buscaPorColuna(colunaValor, colunaNome) {
        const sql = `SELECT * FROM ${this._tabela} WHERE ${colunaNome} = ?`
        return this.getQuery(sql, colunaValor)
    }

    async buscarPorDuasColunas(colunaValor1, colunaValor2, colunaNome1, colunaNome2) {
        const sql = `SELECT * FROM ${this._tabela} WHERE ${colunaNome1} = ? AND ${colunaNome2} = ?`
        return this.allQuery(sql, [colunaValor1, colunaValor2])
    }

    async buscaTodos() {
        const sql = `SELECT * FROM ${this._tabela}`
        return this.allQuery(sql)
    }

}