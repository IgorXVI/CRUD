const DAO = require("./DAO")

module.exports = class FuncionariosDAO extends DAO {
    constructor(connection) {
        super(connection)
    }

    adiciona(funcionario) {
        return super.adiciona(funcionario, `funcionarios`, `CPF, nome, email, senha, salario, idCidade, nivelAcesso, 
        dataAlteracao, dataCriacao, bairro, rua, numeroCasa, telefone, dataNasc, complemento`)
    }

    atualizaPorID(funcionario, id){
        return super.atualizaPorColuna(funcionario, id, `id`, `funcionarios`, `CPF = ?, nome = ?, email = ?, senha = ?, 
        salario = ?, idCidade = ?, nivelAcesso = ?, dataAlteracao = ?, dataCriacao = ?, bairro = ?, rua = ?, 
        numeroCasa = ?, telefone = ?, dataNasc = ?, complemento = ?`)
    }

    deletaPorID(id){
        return super.deletaPorColuna(id, `id`, `funcionarios`)
    }

    buscaPorEmail(email) {
        return super.buscaPorColuna(email, `email`, `funcionarios`)
    }

    buscaPorID(id) {
        return super.buscaPorColuna(id, `id`, `funcionarios`)
    }

    buscaTodos() {
        return super.buscaTodos(`funcionarios`)
    }

}