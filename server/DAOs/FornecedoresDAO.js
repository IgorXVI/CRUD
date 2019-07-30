const DAO = require("./DAO")

module.exports = class FornecedoresDAO extends DAO {
    constructor() {
        super(`fornecedores`)
    }

    async adiciona(fornecedor) {
        return super.adiciona(fornecedor, `CNPJ, nome, email, idCidade, dataAlteracao, 
        dataCriacao, telefone, bairro, rua, numeroCasa, complemento`)
    }

    async atualizaPorID(fornecedor, id){
        return super.atualizaPorColuna(fornecedor, id, `id`, `CNPJ, nome, email, idCidade, dataAlteracao, 
        telefone, bairro, rua, numeroCasa, complemento`)
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