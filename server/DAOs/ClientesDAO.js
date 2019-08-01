const DAO = require("./DAO")

module.exports = class ClientesDAO extends DAO {
    constructor() {
        super(`clientes`)
    }

    async adiciona(cliente) {
        return super.adiciona(cliente, `CPF, nome, email, idCidades, dataAlteracao, 
        dataCriacao, bairro, rua, numeroCasa, telefone, dataNasc, complemento`)
    }

    async atualizaPorID(cliente, id){
        return super.atualizaPorColuna(cliente, id, `id`, `CPF, nome, email, idCidades, dataAlteracao, 
        bairro, rua, numeroCasa, telefone, dataNasc, complemento`)
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