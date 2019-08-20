const Model = require("./Model")
module.exports = class Estoque extends Model {
    constructor() {
        super("itemEstocado", "estoque", ["quantidade", "produto", "armazem"])
    }

    async quantidadeAttr(novaQuantidade, local) {
        await this._validaNotNull("quantidade", novaQuantidade, local)
        await this._validaInteiro("quantidade", novaQuantidade, 0, undefined, local)
        return novaQuantidade
    }

    async produtoAttr(novoProduto, local) {
        await this._validaFK("produto", "produtos", novoProduto, local)
        return novoProduto
    }

    async armazemAttr(novoArmazem, local){
        await this._validaFK("armazem", "armazens", novoArmazem, local)
        return novoArmazem
    }

}