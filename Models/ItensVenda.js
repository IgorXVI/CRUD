const Model = require("./Model")

module.exports = class ItensVenda extends Model {
    constructor() {
        super("item", "itensVenda")

        Object.assign(this.attrsValidacao, {
            valorTotal: {
                validacao: this._validaValorTotal,
                sql: `REAL NOT NULL`
            },
            quantiade: {
                validacao: this._validaQuantidade,
                sql: `INTEGER NOT NULL`
            },
            produto: {
                validacao: this._validaProduto,
                sql: `INTEGER NOT NULL`,
                fk: {
                    tabela: `produtos`,
                    attr: `id`
                }
            },
            venda: {
                validacao: this._validaVenda,
                sql: `INTEGER NOT NULL`,
                fk: {
                    tabela: `vendas`,
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

    async _validaQuantidade(novaQuantidade, local) {
        await this._validaNotNull("quantiade", novaQuantidade, local)
        await this._validaInteiro("quantidade", novaQuantidade, 1, undefined, local)
    }

    async _validaProduto(novoProduto, local) {
        await this._validaFK("produto", "produtos", novoProduto, local)
    }

    async _validaVenda(novaVenda, local) {
        await this._validaFK("venda", "vendas", novaVenda, local)
    }

}