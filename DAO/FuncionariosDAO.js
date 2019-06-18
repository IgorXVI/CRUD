module.exports = class FuncionariosDAO {
    constructor(connection){
        this._connection = connection
    }

    adiciona(funcionario){
        const valoresFuncionario = Object.values(funcionario)
        const placeholders = valoresFuncionario.map((valor) => '(?)').join(',')
        const colunas = `CPF, nome, email, senha, salario, idCidade, nivelAcesso, dataAlteracao, dataCriacao, bairro, rua, numeroCasa, telefone, dataNasc, complemento`
        const sql = `INSERT INTO funcionarios (${colunas}) SET ${placeholders}`

        return new Promise((resolve, reject)=>{
            this._connection.run(sql, valoresFuncionario,(erro)=>{
                if(erro){
                    reject(new Error(erro))
                    return
                }
                resolve()
            })
        })
    }

    buscaPorEmail(email){
        const valorEmail = [email]
        const sql = `SELECT id FROM funcionarios WHERE email = ?`
        
        return new Promise((resolve, reject)=>{
            this._connection.get(sql, valorEmail, (erro, funcionario)=>{
                if(erro){
                    reject(new Error(erro))
                    return
                }
                resolve(funcionario)
            })
        })
    }

    buscaTodosEmails(){
        const sql = `SELECT email FROM funcionarios`

        return new Promise((resolve, reject)=>{
            this._connection.all(sql, (erro, emails)=>{
                if(erro){
                    reject(new Error(erro))
                    return
                }
                resolve(emails)
            })
        })
    }
}
