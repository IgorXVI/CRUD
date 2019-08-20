const Model = require("./Model")

module.exports = class Vendas extends Model {
    constructor() {
        super("venda", "vendas", ["cliente", "valorTotal"])
    }

    async valorTotalAttr(novoValorTotal, local){
        await this._validaNotNull("valorTotal", novoValorTotal, local)
        await this._validaDecimal("valorTotal", novoValorTotal, 0, undefined, local)
        return novoValorTotal
    }

    async clienteAttr(novoCliente, local){
        await this._validaFK("cliente", "clientes", novoCliente, local)
        return novoCliente
    }

}