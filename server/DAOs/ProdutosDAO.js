const DAO = require("./DAO")

module.exports = class ProdutosDAO extends DAO {
    constructor() {
        super(`produtos`)
    }

    async adiciona(produto) {
        return super.adiciona(produto, `nome, categoria, precoUnidade, idFornecedor, dataAlteracao, 
        dataCriacao, descricao, garantia, dataFabric, dataValidade`)
    }

    async atualizaPorID(produto, id){
        return super.atualizaPorColuna(produto, id, `id`, `nome, categoria, precoUnidade, idFornecedor, dataAlteracao, 
        descricao, garantia, dataFabric, dataValidade`)
    }

    async deletaPorID(id){
        return super.deletaPorColuna(id, `id`)
    }

    async buscaPorNome(nome){
        return super.buscaPorColuna(nome, `nome`)
    }

    async buscaPorID(id) {
        return super.buscaPorColuna(id, `id`)
    }

}