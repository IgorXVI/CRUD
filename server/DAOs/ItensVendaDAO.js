const DAO = require("./DAO")

module.exports = class ItensVendaDAO extends DAO {
    constructor() {
        super(`itensVenda`)
    }

    async adiciona(item) {
        return super.adiciona(item, `valorTotal, quantidade, idProduto, idVenda, dataAlteracao, dataCriacao`)
    }

    async atualizaPorID(item, id){
        return super.atualizaPorColuna(item, id, `id`, `valorTotal, quantidade, idProduto, idVenda, dataAlteracao`)
    }

    async deletaPorID(id){
        return super.deletaPorColuna(id, `id`)
    }

    async buscaPorID(id) {
        return super.buscaPorColuna(id, `id`)
    }

    async buscaPorIDVendaEIDProduto(idVenda, idProduto){
        return super.buscarPorDuasColunas(idVenda, idProduto, `idVenda`, `idProduto`)
    }

}