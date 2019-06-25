const DAO = require("./DAO")

module.exports = class VendasDAO extends DAO{
    constructor(connection) {
        super(connection, `vendas`)
    }

    adiciona(venda) {
        return super.adiciona(venda, `valorTotal, idFuncionario, idCliente, dataAlteracao, dataCriacao`)
    }

    atualizaPorID(venda, id){
        return super.atualizaPorColuna(venda, id, `id`, `valorTotal, idFuncionario, idCliente, dataAlteracao`)
    }

    deletaPorID(id){
        return super.deletaPorColuna(id, `id`)
    }

    buscaPorID(id) {
        return super.buscaPorColuna(id, `id`)
    }
}