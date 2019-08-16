const Model = require("./Model")
const Produtos = require("./Produtos")
const Vendas = require("./Vendas")

module.exports = class ItensVenda extends Model {
    constructor() {
        super("item", "itensVenda")
    }

    async valorTotalAttr(novoValorTotal) {
        await this._validaNotNull("valorTotal", novoValorTotal)
        await this._validaDecimal("valorTotal", novoValorTotal, 0)
        return novoValorTotal
    }

    async quantidadeAttr(novaQuantidade) {
        await this._validaNotNull("quantiade", novaQuantidade)
        await this._validaInteiro("quantidade", novaQuantidade, 1)
        return novaQuantidade
    }

    async produtoAttr(novoProduto) {
        const produtos = new Produtos()
        return await produtos.idAttr(novoProduto)
    }

    async vendaAttr(novaVenda) {
        const vendas = new Vendas()
        return await vendas.idAttr(novaVenda)
    }

}