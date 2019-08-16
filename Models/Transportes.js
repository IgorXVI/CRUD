const Model = require("./Model")
const ItensVenda = require("./ItensVenda")
const Armazens = require("./Armazens")

module.exports = class Transportes extends Model {
    constructor(){
        super("transporte", "transportes")

        this.itemVendaFK = {}
        this.armazemFk = {}
    }

    async quantidadeAttr(novaQuantidade){
        await this._validaNotNull("quantiade", novaQuantidade)
        await this._validaInteiro("quantidade", novaQuantidade, 1)
        return novaQuantidade
    }

    async itemVendaAttr(novoItemVenda){
        const itensVenda = new ItensVenda()
        return await itensVenda.idAttr(novoItemVenda)
    }

    async armazemAttr(novoArmazem){
        const armazens = new Armazens()
        return await armazens.idAttr(novoArmazem)
    }

}