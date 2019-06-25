const DAO = require("./DAO")

module.exports = class FornecedoresDAO extends DAO {
    constructor(connection) {
        super(connection, `fornecedores`)
    }

    adiciona(fornecedor) {
        return super.adiciona(fornecedor, `CNPJ, nome, email, idCidade, dataAlteracao, 
        dataCriacao, telefone, bairro, rua, numeroCasa, complemento`)
    }

    atualizaPorID(fornecedor, id){
        return super.atualizaPorColuna(fornecedor, id, `id`, `CNPJ, nome, email, idCidade, dataAlteracao, 
        telefone, bairro, rua, numeroCasa, complemento`)
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