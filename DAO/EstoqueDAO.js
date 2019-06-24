const DAO = require("./DAO")

module.exports = class EstoqueDAO extends DAO {
    constructor(connection) {
        super(connection, `estoque`)
    }

    adiciona(estoque) {
        return super.adiciona(estoque, `quantidade, idProduto, dataAlteracao, dataCriacao`)
    }

    atualizaPorID(estoque, id){
        return super.atualizaPorColuna(estoque, id, `id`, `quantidade, idProduto, dataAlteracao`)
    }

    deletaPorID(id){
        return super.deletaPorColuna(id, `id`)
    }

    buscaPorID(id) {
        return super.buscaPorColuna(id, `id`)
    }
}