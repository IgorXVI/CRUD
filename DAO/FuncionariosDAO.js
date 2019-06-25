const DAO = require("./DAO")

module.exports = class FuncionariosDAO extends DAO {
    constructor(connection) {
        super(connection, `funcionarios`)
    }

    adiciona(funcionario) {
        return super.adiciona(funcionario, `CPF, nome, email, salario, idCidade, dataAlteracao, 
        dataCriacao, bairro, rua, numeroCasa, telefone, dataNasc, complemento`)
    }

    atualizaPorID(funcionario, id){
        return super.atualizaPorColuna(funcionario, id, `id`, `CPF, nome, email, salario, idCidade, dataAlteracao, 
        bairro, rua, numeroCasa, telefone, dataNasc, complemento`)
    }

    deletaPorID(id){
        return super.deletaPorColuna(id, `id`)
    }

    buscaPorEmail(email) {
        return super.buscaPorColuna(email, `email`)
    }

    buscaPorID(id) {
        return super.buscaPorColuna(id, `id`)
    }

}