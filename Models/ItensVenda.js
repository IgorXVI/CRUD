const Model = require("./Model")

module.exports = class ItensVenda extends Model {
    constructor() {
        super("item", "itensVenda")

        Object.assign(this.attrs, {
            valorTotal: {
                validacao: this._validaValorTotal,
                sql: `REAL NOT NULL`
            },
            quantiade: {
                validacao: this._validaQuantidade,
                sql: `INTEGER NOT NULL`
            },
            produto: {
                validacaoQuery: this._validaProdutoQuery,
                validacaoAttr: this._validaProdutoAttr,
                sql: `INTEGER NOT NULL`,
                fk: {
                    tabela: `produtos`,
                    attr: `id`
                }
            },
            venda: {
                validacaoQuery: this._validaVendaQuery,
                validacaoAttr: this._validaVendaAttr,
                sql: `INTEGER NOT NULL`,
                fk: {
                    tabela: `vendas`,
                    attr: `id`
                }
            }
        })

        this._gerarAtributosJSON = this._gerarAtributosJSON.bind(this)
        
        this._gerarSchema()
    }

    async _gerarAtributosJSON(objeto, local) {
        const o = await super._gerarAtributosJSON(objeto, local)
        await this._validaCombinacaoUnica({venda: o.venda, produto: o.produto}, local)
        if (this.errosValidacao.errors.length > 0) {
            throw new Error("Erros de validação.")
        }
        return o
    }

    async _validaValorTotal(novoValorTotal, local) {
        await this._validaNotNull("valorTotal", novoValorTotal, local)
        await this._validaDecimal("valorTotal", novoValorTotal, 0, undefined, local)
    }

    async _validaQuantidade(novaQuantidade, local) {
        await this._validaNotNull("quantiade", novaQuantidade, local)
        await this._validaInteiro("quantidade", novaQuantidade, 1, undefined, local)
    }

    async _validaProdutoQuery(novoProduto, local) {
        await this._validaPK("produto", novoProduto, local)
    }

    async _validaProdutoAttr(novoProduto, local) {
        await this._validaFK("produto", "produtos", novoProduto, local)
    }

    async _validaVendaQuery(novaVenda, local) {
        await this._validaPK("venda", novaVenda, local)
    }

    async _validaVendaAttr(novaVenda, local) {
        await this._validaFK("venda", "vendas", novaVenda, local)
    }

}