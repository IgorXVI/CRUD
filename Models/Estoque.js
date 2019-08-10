const AlgoComEndereco = require("./AlgoComEndereco")
const DAO = require("../database/DAO")

module.exports = class Estoque extends AlgoComEndereco {
    constructor() {
        super("itemEstocado", "estoque")

        this.JSON.quantidade = 0
        this.JSON.produto = 0
    }

    async quantidade(novaQuantidade) {
        await this._validaNotNull("quantidade", novaQuantidade)
        await this._validaInteiro("quantidade", novaQuantidade, 0)
        this.JSON.quantidade = novaQuantidade
    }

    async produto(novoProduto) {
        await this._validaNotNull("produto", novoProduto)
        await this._validaInteiro("produto", novoProduto, 1)
        await this._validaExiste(new DAO("produtos"), "produto", novoProduto)
        this.JSON.produto = novoProduto
    }

}