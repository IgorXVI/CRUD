module.exports = class ClientesDAO {
    constructor(connection) {
        this._connection = connection
    }

    adiciona(cliente) {
        const valoresCliente = Object.values(cliente)
        const placeholders = valoresCliente.map((valor) => '?').join(',')
        const sql = `INSERT INTO clientes (CPF, nome, email, idCidade, dataAlteracao, 
            dataCriacao, bairro, rua, numeroCasa, telefone, dataNasc, complemento) VALUES (${placeholders})`
        return new Promise((resolve, reject) => {
            this._connection.run(sql, valoresCliente, (erro) => {
                if (erro) {
                    reject(new Error(erro))
                    return
                }
                resolve()
            })
        })
    }

    atualizaPorID(cliente, id){
        const valoresCliente = Object.values(cliente)
        valoresCliente.push(id)
        const sql = `UPDATE clientes SET CPF = ?, nome = ?, email = ?, idCidade = ?, dataAlteracao = ?, 
            dataCriacao = ?, bairro = ?, rua = ?, numeroCasa = ?, telefone = ?, dataNasc = ?, complemento = ? WHERE id = ?`
        return new Promise((resolve, reject) => {
            this._connection.run(sql, valoresCliente, (erro) => {
                if (erro) {
                    reject(new Error(erro))
                    return
                }
                resolve()
            })
        })
    }

    deletaPorID(id){
        const sql = `DELETE FROM clientes WHERE id = ?`

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
        const sql = `SELECT * FROM clientes WHERE email = ?`

        return new Promise((resolve, reject) => {
            this._connection.get(sql, [email], (erro, cliente) => {
                if (erro) {
                    reject(new Error(erro))
                    return
                }
                resolve(cliente)
            })
        })
    }

    buscaPorID(id) {
        const sql = `SELECT * FROM clientes WHERE id = ?`

        return new Promise((resolve, reject) => {
            this._connection.get(sql, [id], (erro, cliente) => {
                if (erro) {
                    reject(new Error(erro))
                    return
                }
                resolve(cliente)
            })
        })
    }

    buscaTodos() {
        const sql = `SELECT * FROM clientes`

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