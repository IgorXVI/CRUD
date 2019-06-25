module.exports = class DAO {
    constructor(connection, tabela) {
        this._connection = connection
        this._tabela = tabela
    }

    adiciona(objeto, colunas) {
        const valores = Object.values(objeto)
        const placeholders = valores.map((valor) => '?').join(',')
        const sql = `INSERT INTO ${this._tabela} (${colunas}) VALUES (${placeholders})`
        return new Promise((resolve, reject) => {
            this._connection.run(sql, valores, (erro) => {
                if (erro) {
                    reject(new Error(erro))
                    return
                }
                resolve()
            })
        })
    }

    atualizaPorColuna(objeto, colunaValor, colunaNome, colunas){
        const valores = Object.values(objeto)
        valores.push(colunaValor)
        const colunasEPlaceholders = colunas.split(",").map(nome => `${nome} = ?`).join(",")

        const sql = `UPDATE ${this._tabela} SET ${colunasEPlaceholders} WHERE ${colunaNome} = ?`
        return new Promise((resolve, reject) => {
            this._connection.run(sql, valores, (erro) => {
                if (erro) {
                    reject(new Error(erro))
                    return
                }
                resolve()
            })
        })
    }

    deletaPorColuna(colunaValor, colunaNome){
        const sql = `DELETE FROM ${this._tabela} WHERE ${colunaNome} = ?`

        return new Promise((resolve, reject) => {
            this._connection.run(sql, [colunaValor], (erro) => {
                if (erro) {
                    reject(new Error(erro))
                    return
                }
                resolve()
            })
        })
    }

    buscaPorColuna(colunaValor, colunaNome) {
        const sql = `SELECT * FROM ${this._tabela} WHERE ${colunaNome} = ?`

        return new Promise((resolve, reject) => {
            this._connection.get(sql, [colunaValor], (erro, objeto) => {
                if (erro) {
                    reject(new Error(erro))
                    return
                }
                resolve(objeto)
            })
        })
    }

    buscaTodos() {
        const sql = `SELECT * FROM ${this._tabela}`

        return new Promise((resolve, reject) => {
            this._connection.all(sql, (erro, todos) => {
                if (erro) {
                    reject(new Error(erro))
                    return
                }
                resolve(todos)
            })
        })
    }

}