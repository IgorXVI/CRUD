const Model = require("./Model")

module.exports = class Transportes extends Model {
    constructor(){
        super("transporte", "transportes")

        Object.assign(this.attrsValidacao, {
            quantidade: this._validaQuantidade,
            itemVenda: this._validaItemVenda,
            armazem: this._validaArmazem
        })

        this._gerarSchema()
    }

    async _validaQuantidade(novaQuantidade, local){
        await this._validaNotNull("quantiade", novaQuantidade, local)
        await this._validaInteiro("quantidade", novaQuantidade, 1, undefined, local)
    }

    async _validaItemVenda(novoItemVenda, local){
        await this._validaFK("itemVenda", "itensVenda", novoItemVenda, local)
    }

    async _validaArmazem(novoArmazem, local){
        await this._validaFK("armazem", "armazens", novoArmazem, local)
    }

}