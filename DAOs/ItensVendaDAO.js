const DAO = require("./DAO")

module.exports = class ItensVendaDAO extends DAO {
    constructor(connection) {
        super(connection, `itensVenda`)
    }

    adiciona(item) {
        return super.adiciona(item, `valorTotal, quantidade, idProduto, idVenda, dataAlteracao, dataCriacao`)
    }

    atualizaPorID(item, id){
        return super.atualizaPorColuna(item, id, `id`, `valorTotal, quantidade, idProduto, idVenda, dataAlteracao`)
    }

    deletaPorID(id){
        return super.deletaPorColuna(id, `id`)
    }

    buscaPorID(id) {
        return super.buscaPorColuna(id, `id`)
    }

}