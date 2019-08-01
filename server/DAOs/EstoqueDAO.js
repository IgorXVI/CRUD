const DAO = require("./DAO")

module.exports = class EstoqueDAO extends DAO {
    constructor() {
        super(`estoque`)
    }

    async adiciona(estoque) {
        return super.adiciona(estoque, `quantidade, idProdutos, dataAlteracao, dataCriacao`)
    }

    async atualizaPorID(estoque, id){
        return super.atualizaPorColuna(estoque, id, `id`, `quantidade, idProdutos, dataAlteracao`)
    }

    async deletaPorID(id){
        return super.deletaPorColuna(id, `id`)
    }

    async buscaPorID(id) {
        return super.buscaPorColuna(id, `id`)
    }

    async buscaPorIDdeProduto(id){
        return super.buscaPorColuna(id, `idProduto`)
    }

}