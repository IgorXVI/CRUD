module.exports = class DAO {
    constructor(connection) {
        this._connection = connection
    }

    adiciona(objeto, tabela, colunas) {
        const valores = Object.values(objeto)
        const placeholders = valores.map((valor) => '?').join(',')
        const sql = `INSERT INTO ${tabela} (${colunas}) VALUES (${placeholders})`
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

    atualizaPorColuna(objeto, colunaValor, colunaNome, tabela, colunasEPlaceholders){
        const valores = Object.values(objeto)
        valores.push(colunaValor)
        const sql = `UPDATE ${tabela} SET ${colunasEPlaceholders} WHERE ${colunaNome} = ?`
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

    deletaPorColuna(colunaValor, colunaNome, tabela){
        const sql = `DELETE FROM ${tabela} WHERE ${colunaNome} = ?`

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

    buscaPorColuna(colunaValor, colunaNome, tabela) {
        const sql = `SELECT * FROM ${tabela} WHERE ${colunaNome} = ?`

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

    buscaTodos(tabela) {
        const sql = `SELECT * FROM ${tabela}`

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