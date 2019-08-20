const Model = require("./Model")

module.exports = class Vendas extends Model {
    constructor() {
        super("venda", "vendas")

        Object.assign(this.attrsValidacao, {
            valorTotal: this._validaValorTotal,
            cliente: this._validaCliente
        })

        this._gerarSchema()
    }

    async _validaValorTotal(novoValorTotal, local){
        await this._validaNotNull("valorTotal", novoValorTotal, local)
        await this._validaDecimal("valorTotal", novoValorTotal, 0, undefined, local)
    }

    async _validaCliente(novoCliente, local){
        await this._validaFK("cliente", "clientes", novoCliente, local)
    }

}