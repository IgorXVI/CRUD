const DAO = require("./DAO")

module.exports = class VendasDAO extends DAO{
    constructor() {
        super(`vendas`)
    }

    async adiciona(venda) {
        return super.adiciona(venda, `valorTotal, idFuncionario, idCliente, dataAlteracao, dataCriacao`)
    }

    async atualizaPorID(venda, id){
        return super.atualizaPorColuna(venda, id, `id`, `valorTotal, idFuncionario, idCliente, dataAlteracao`)
    }

    async deletaPorID(id){
        return super.deletaPorColuna(id, `id`)
    }

    async buscaPorID(id) {
        return super.buscaPorColuna(id, `id`)
    }
}