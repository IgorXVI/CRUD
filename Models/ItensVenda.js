const Model = require("./Model")

module.exports = class ItensVenda extends Model {
    constructor() {
        super("item", "itensVenda", ["valorTotal", "quantiade", "produto", "venda"])
    }

    async valorTotalAttr(novoValorTotal, local) {
        await this._validaNotNull("valorTotal", novoValorTotal, local)
        await this._validaDecimal("valorTotal", novoValorTotal, 0, undefined, local)
        return novoValorTotal
    }

    async quantidadeAttr(novaQuantidade, local) {
        await this._validaNotNull("quantiade", novaQuantidade, local)
        await this._validaInteiro("quantidade", novaQuantidade, 1, undefined, local)
        return novaQuantidade
    }

    async produtoAttr(novoProduto, local) {
        await this._validaFK("produto", "produtos", novoProduto, local)
        return novoProduto
    }

    async vendaAttr(novaVenda, local) {
        await this._validaFK("venda", "vendas", novaVenda, local)
        return novaVenda
    }

}