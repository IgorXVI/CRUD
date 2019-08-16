const Model = require("./Model")
const Produtos = require("./Produtos")
const Armazens = require("./Armazens")
module.exports = class Estoque extends Model {
    constructor() {
        super("itemEstocado", "estoque")

        this.produtoFK = {}
        this.armazemFK = {}
    }

    async quantidadeAttr(novaQuantidade) {
        await this._validaNotNull("quantidade", novaQuantidade)
        await this._validaInteiro("quantidade", novaQuantidade, 0)
        return novaQuantidade
    }

    async produtoAttr(novoProduto) {
        const produtos = new Produtos()
        return await produtos.idAttr(novoProduto)
    }

    async armazemAttr(novoArmazem){
        const armazens = new Armazens()
        return await armazens.idAttr(novoArmazem)
    }

}