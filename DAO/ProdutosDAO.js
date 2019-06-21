module.exports = class ProdutosDAO {
    constructor(connection) {
        this._connection = connection
    }

    adiciona(produto) {
        const valoresProduto = Object.values(produto)
        const placeholders = valoresProduto.map((valor) => '?').join(',')
        const sql = `INSERT INTO produtos (CPF, nome, categoria, precoUnidade, idFornecedor, dataAlteracao, 
            dataCriacao, imagem, descricao, garantia, dataFabric, dataValidade) VALUES (${placeholders})`
        return new Promise((resolve, reject) => {
            this._connection.run(sql, valoresProduto, (erro) => {
                if (erro) {
                    reject(new Error(erro))
                    return
                }
                resolve()
            })
        })
    }

    atualizaPorID(objeto, id){
        const valores = Object.values(objeto)
        valores.push(id)
        const sql = `UPDATE produtos SET CPF = ?, nome = ?, categoria = ?, precoUnidade = ?, idFornecedor = ?, 
        dataAlteracao = ?, dataCriacao = ?, imagem = ?, descricao = ?, garantia = ?, dataFabric = ?, 
        dataValidade = ? WHERE id = ?`
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

    deletaPorID(id){
        const sql = `DELETE FROM produtos WHERE id = ?`

        return new Promise((resolve, reject) => {
            this._connection.run(sql, [id], (erro) => {
                if (erro) {
                    reject(new Error(erro))
                    return
                }
                resolve()
            })
        })
    }

    buscaPorID(id) {
        const sql = `SELECT * FROM produtos WHERE id = ?`

        return new Promise((resolve, reject) => {
            this._connection.get(sql, [id], (erro, objeto) => {
                if (erro) {
                    reject(new Error(erro))
                    return
                }
                resolve(objeto)
            })
        })
    }

    buscaTodos() {
        const sql = `SELECT * FROM produtos`

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