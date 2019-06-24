const DAO = require("./DAO")

module.exports = class ProdutosDAO extends DAO {
    constructor(connection) {
        super(connection, `produtos`)
    }

    adiciona(produto) {
        return super.adiciona(produto, `nome, categoria, precoUnidade, idFornecedor, dataAlteracao, 
        dataCriacao, descricao, garantia, dataFabric, dataValidade`)
    }

    atualizaPorID(produto, id){
        return super.atualizaPorColuna(produto, id, `id`, `nome, categoria, precoUnidade, idFornecedor, dataAlteracao, 
        descricao, garantia, dataFabric, dataValidade`)
    }

    deletaPorID(id){
        return super.deletaPorColuna(id, `id`)
    }

    buscaPorID(id) {
        return super.buscaPorColuna(id, `id`)
    }

}