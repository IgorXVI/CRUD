module.exports = class FornecedoresDAO {
    constructor(connection) {
        this._connection = connection
    }

    adiciona(fornecedor) {
        const valoresFornecedor = Object.values(fornecedor)
        const placeholders = valoresFornecedor.map((valor) => '?').join(',')
        const sql = `INSERT INTO fornecedores (CNPJ, nome, email, idCidade, dataAlteracao, 
            dataCriacao, telefone, bairro, rua, numeroCasa, complemento) VALUES (${placeholders})`
        return new Promise((resolve, reject) => {
            this._connection.run(sql, valoresFornecedor, (erro) => {
                if (erro) {
                    reject(new Error(erro))
                    return
                }
                resolve()
            })
        })
    }

    atualizaPorID(fornecedor, id){
        const valoresFornecedor = Object.values(fornecedor)
        valoresFornecedor.push(id)
        const sql = `UPDATE fornecedores SET CNPJ = ?, nome = ?, email = ?, idCidade = ?, dataAlteracao = ?, 
            dataCriacao = ?, telefone = ?, bairro = ?, rua = ?, numeroCasa = ?, complemento = ? WHERE id = ?`
        return new Promise((resolve, reject) => {
            this._connection.run(sql, valoresFornecedor, (erro) => {
                if (erro) {
                    reject(new Error(erro))
                    return
                }
                resolve()
            })
        })
    }

    deletaPorID(id){
        const sql = `DELETE FROM fornecedores WHERE id = ?`

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

    buscaPorEmail(email) {
        const sql = `SELECT * FROM fornecedores WHERE email = ?`

        return new Promise((resolve, reject) => {
            this._connection.get(sql, [email], (erro, fornecedor) => {
                if (erro) {
                    reject(new Error(erro))
                    return
                }
                resolve(fornecedor)
            })
        })
    }

    buscaPorID(id) {
        const sql = `SELECT * FROM fornecedores WHERE id = ?`

        return new Promise((resolve, reject) => {
            this._connection.get(sql, [id], (erro, fornecedor) => {
                if (erro) {
                    reject(new Error(erro))
                    return
                }
                resolve(fornecedor)
            })
        })
    }

    buscaTodos() {
        const sql = `SELECT * FROM fornecedores`

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