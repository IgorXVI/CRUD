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
        colunas += `,dataAlteracao,dataCriacao`
        
        const valores = Object.values(objeto)

        const placeholders = valores.map(() => '?').join(',')

        const sql = `INSERT INTO ${this._tabela} (${colunas}) VALUES (${placeholders})`
        
        return this.runQuery(sql, valores)
    }

    async atualizaPorColuna(objeto, colunaNome) {
        objeto.dataAlteracao = await this.dataDeHoje()

        let colunas = Object.keys(objeto).join(',')
        colunas += `,dataAlteracao`

        const colunaValor = JSON.parse(JSON.stringify(objeto[colunaNome]))
        delete objeto[colunaNome]
        let valores = Object.values(objeto)
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
        return this.getQuery(sql, [colunaValor1, colunaValor2])
    }

    async buscaTodosPorColuna(colunaValor, colunaNome){
        const sql = `SELECT * FROM ${this._tabela} WHERE ${colunaNome} = ?`
        return this.allQuery(sql, colunaValor)
    }

    async buscaTodos() {
        const sql = `SELECT * FROM ${this._tabela}`
        return this.allQuery(sql)
    }

    async dataDeHoje() {
        return new Date().toISOString()
    }

}