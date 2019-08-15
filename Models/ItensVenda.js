const Model = require("./Model")
const Produtos = require("./Produtos")
const Vendas = require("./Vendas")

module.exports = class ItensVenda extends Model {
    constructor(){
        super("item", "itensVenda")
    }

    async valorTotal(novoValorTotal){
        await this._validaNotNull("valorTotal", novoValorTotal)
        await this._validaDecimal("valorTotal", novoValorTotal, 0)
        return novoValorTotal
    }
    
    async quantidade(novaQuantidade){
        await this._validaNotNull("quantiade", novaQuantidade)
        await this._validaInteiro("quantidade", novaQuantidade, 1)
        return novaQuantidade
    }

    async produto(novoProduto){
        const produtos = new Produtos()
        return produtos.id(novoProduto)
    }

    async venda(novaVenda){
        const vendas = new Vendas()
        return vendas.id(novaVenda)
    }

}