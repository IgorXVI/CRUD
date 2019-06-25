const DAO = require("./DAO")

module.exports = class ClientesDAO extends DAO {
    constructor(connection) {
        super(connection, `clientes`)
    }

    adiciona(cliente) {
        return super.adiciona(cliente, `CPF, nome, email, idCidade, dataAlteracao, 
        dataCriacao, bairro, rua, numeroCasa, telefone, dataNasc, complemento`)
    }

    atualizaPorID(cliente, id){
        return super.atualizaPorColuna(cliente, id, `id`, `CPF, nome, email, idCidade, dataAlteracao, 
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