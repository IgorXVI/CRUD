module.exports = class FuncionariosDAO {
    constructor(connection) {
        this._connection = connection
    }

    adiciona(funcionario) {
        const valoresFuncionario = Object.values(funcionario)
        const placeholders = valoresFuncionario.map((valor) => '?').join(',')
        const sql = `INSERT INTO funcionarios (CPF, nome, email, senha, salario, idCidade, nivelAcesso, dataAlteracao, 
            dataCriacao, bairro, rua, numeroCasa, telefone, dataNasc, complemento) VALUES (${placeholders})`
        return new Promise((resolve, reject) => {
            this._connection.run(sql, valoresFuncionario, (erro) => {
                if (erro) {
                    reject(new Error(erro))
                    return
                }
                resolve()
            })
        })
    }

    atualiza(funcionario, id){
        const valoresFuncionario = Object.values(funcionario)
        valoresFuncionario.push(id)
        const sql = `UPDATE funcionarios SET CPF = ?, nome = ?, email = ?, senha = ?, salario = ?, idCidade = ?, nivelAcesso = ?, dataAlteracao = ?, 
            dataCriacao = ?, bairro = ?, rua = ?, numeroCasa = ?, telefone = ?, dataNasc = ?, complemento = ? WHERE id = ?`
        return new Promise((resolve, reject) => {
            this._connection.run(sql, valoresFuncionario, (erro) => {
                if (erro) {
                    reject(new Error(erro))
                    return
                }
                resolve()
            })
        })
    }

    deletaPorID(id){
        const sql = `DELETE FROM funcionarios WHERE id = ?`

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
        const sql = `SELECT * FROM funcionarios WHERE email = ?`

        return new Promise((resolve, reject) => {
            this._connection.get(sql, [email], (erro, funcionario) => {
                if (erro) {
                    reject(new Error(erro))
                    return
                }
                resolve(funcionario)
            })
        })
    }

    buscaPorID(id) {
        const sql = `SELECT * FROM funcionarios WHERE id = ?`

        return new Promise((resolve, reject) => {
            this._connection.get(sql, [id], (erro, funcionario) => {
                if (erro) {
                    reject(new Error(erro))
                    return
                }
                resolve(funcionario)
            })
        })
    }

    buscaTodos() {
        const sql = `SELECT * FROM funcionarios`

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