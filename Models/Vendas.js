const Model = require("./Model")

module.exports = class Vendas extends Model {
    constructor() {
        super("venda", "vendas")

        Object.assign(this.attrsValidacao, {
            valorTotal: {
                validacao: this._validaValorTotal,
                sql: `REAL NOT NULL`
            },
            cliente: {
                validacao: this._validaCliente,
                sql: `INTEGER NOT NULL`,
                fk: {
                    tabela: `clientes`,
                    attr: `id`
                }
            }
        })

        this._gerarSchema()
    }

    async _validaValorTotal(novoValorTotal, local) {
        await this._validaNotNull("valorTotal", novoValorTotal, local)
        await this._validaDecimal("valorTotal", novoValorTotal, 0, undefined, local)
    }

    async _validaCliente(novoCliente, local) {
        await this._validaFK("cliente", "clientes", novoCliente, local)
    }

}