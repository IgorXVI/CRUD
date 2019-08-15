const Model = require("./Model")
const Produtos = require("./Produtos")
const Armazens = require("./Armazens")

module.exports = class Estoque extends Model {
    constructor() {
        super("itemEstocado", "estoque")
    }

    async quantidade(novaQuantidade) {
        await this._validaNotNull("quantidade", novaQuantidade)
        await this._validaInteiro("quantidade", novaQuantidade, 0)
        return novaQuantidade
    }

    async produto(novoProduto) {
        const produtos = new Produtos()
        return produtos.id(novoProduto)
    }

    async armazem(novoArmazem){
        const armazens = new Armazens()
        return armazens.id(novoArmazem)
    }

}