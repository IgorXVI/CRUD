const DAO = require("./DAO")

module.exports = class FuncionariosDAO extends DAO {
    constructor(connection) {
        super(connection)
    }

    adiciona(funcionario) {
        super.adiciona(funcionario, `funcionarios`, `CPF, nome, email, senha, salario, idCidade, nivelAcesso, 
        dataAlteracao, dataCriacao, bairro, rua, numeroCasa, telefone, dataNasc, complemento`)
    }

    atualizaPorID(funcionario, id){
        super.atualizaPorColuna(funcionario, id, `id`, `funcionarios`, `CPF = ?, nome = ?, email = ?, senha = ?, 
        salario = ?, idCidade = ?, nivelAcesso = ?, dataAlteracao = ?, dataCriacao = ?, bairro = ?, rua = ?, 
        numeroCasa = ?, telefone = ?, dataNasc = ?, complemento = ?`)
    }

    deletaPorID(id){
        super.deletaPorColuna(id, `id`, `funcionarios`)
    }

    buscaPorEmail(email) {
        super.buscaPorColuna(email, `email`, `funcionarios`)
    }

    buscaPorID(id) {
        super.buscaPorColuna(id, `id`, `funcionarios`)
    }

    buscaTodos() {
        super.buscaTodos(`funcionarios`)
    }

}