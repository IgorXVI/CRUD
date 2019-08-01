const dbConnection = require("../config/db")

module.exports = class DAO {
    constructor(tabela) {
        this._connection = dbConnection
        this._tabela = tabela
    }

    async adiciona(objeto, colunas) {
        const valores = Object.values(objeto)

        const placeholders = valores.map((valor) => '?').join(',')

        const sql = `INSERT INTO ${this._tabela} (${colunas}) VALUES (${placeholders})`

        this._connection.run(sql, valores, (erro) => {
            if (erro) {
                throw new Error(erro)
            }
        })
    }

    async atualizaPorColuna(objeto, colunaValor, colunaNome, colunas) {
        const valores = Object.values(objeto)
        valores.push(colunaValor)

        const colunasEPlaceholders = colunas.split(",").map(nome => `${nome} = ?`).join(",")

        const sql = `UPDATE ${this._tabela} SET ${colunasEPlaceholders} WHERE ${colunaNome} = ?`

        this._connection.run(sql, valores, (erro) => {
            if (erro) {
                throw new Error(erro)
            }
        })
    }

    async deletaPorColuna(colunaValor, colunaNome) {
        const sql = `DELETE FROM ${this._tabela} WHERE ${colunaNome} = ?`

        this._connection.run(sql, [colunaValor], (erro) => {
            if (erro) {
                throw new Error(erro)
            }
        })
    }

    async buscaPorColuna(colunaValor, colunaNome) {
        const sql = `SELECT * FROM ${this._tabela} WHERE ${colunaNome} = ?`
        let resultado = undefined
        this._connection.get(sql, [colunaValor], (erro, objeto) => {
            if (erro) {
                throw new Error(erro)
            } else {
               resultado = objeto
            }
        })
        return resultado
    }

    async buscarPorDuasColunas(colunaValor1, colunaValor2, colunaNome1, colunaNome2) {
        const sql = `SELECT * FROM ${this._tabela} WHERE ${colunaNome1} = ? AND ${colunaNome2} = ?`
        let resultado = undefined 
        this._connection.get(sql, [colunaValor1, colunaValor2], (erro, objeto) => {
            if (erro) {
                throw new Error(erro)
            } else {
                resultado = objeto
            }
        })
        return resultado
    }

    async buscaTodos() {
        const sql = `SELECT * FROM ${this._tabela}`
        this._connection.all(sql, (erro, objeto) => {
            if (erro) {
                throw new Error(erro)
            } else {
                Promise.resolve(objeto)
            }
        })
    }

}