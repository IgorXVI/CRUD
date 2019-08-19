const Model = require("./Model")

module.exports = class Transportes extends Model {
    constructor(){
        super("transporte", "transportes")

        this.itemVendaFK = {}
        this.armazemFk = {}
    }

    async quantidadeAttr(novaQuantidade, local){
        await this._validaNotNull("quantiade", novaQuantidade, local)
        await this._validaInteiro("quantidade", novaQuantidade, 1, undefined, local)
        return novaQuantidade
    }

    async itemVendaAttr(novoItemVenda, local){
        await this._validaFK("itemVenda", "itensVenda", novoItemVenda, local)
        return novoItemVenda
    }

    async armazemAttr(novoArmazem, local){
        await this._validaFK("armazem", "armazens", novoArmazem, local)
        return novoArmazem
    }

}