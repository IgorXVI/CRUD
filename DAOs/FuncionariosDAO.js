const DAO = require("./DAO")

module.exports = class FuncionariosDAO extends DAO {
    constructor() {
        super(`funcionarios`)
    }

    async adiciona(funcionario) {
        return super.adiciona(funcionario, `CPF, nome, email, salario, idCidades, bairro, rua, numeroCasa, telefone, dataNasc, complemento`)
    }

    async atualizaPorID(funcionario, id){
        return super.atualizaPorColuna(funcionario, id, `id`, `CPF, nome, email, salario, idCidades, bairro, rua, numeroCasa, telefone, dataNasc, complemento`)
    }

    async deletaPorID(id){
        return super.deletaPorColuna(id, `id`)
    }

    async buscaPorEmail(email) {
        return super.buscaPorColuna(email, `email`)
    }

    async buscaPorID(id) {
        return super.buscaPorColuna(id, `id`)
    }

}