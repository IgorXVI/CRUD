const Model = require("./Model")

module.exports = class Vendas extends Model {
    constructor() {
        super("venda", "vendas")

        Object.assign(this.attrs, {
            valorTotal: {
                validacao: this._validaValorTotal,
                sql: `REAL NOT NULL`
            },
            cliente: {
                validacaoQuery: this._validaClienteQuery,
                validacaoAttr: this._validaClienteAttr,
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

    async _validaClienteQuery(novoCliente, local) {
        await this._validaPK("cliente", novoCliente, local)
    }

    async _validaClienteAttr(novoCliente, local) {
        await this._validaFK("cliente", "clientes", novoCliente, local)
    }

}