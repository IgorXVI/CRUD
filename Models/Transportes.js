const Model = require("./Model")

module.exports = class Transportes extends Model {
    constructor() {
        super("transporte", "transportes")

        Object.assign(this.attrs, {
            quantidade: {
                validacao: this._validaQuantidade,
                sql: `INTEGER NOT NULL`
            },
            itemVenda: {
                validacaoQuery: this._validaItemVendaQuery,
                validacaoAttr: this._validaItemVendaAttr,
                sql: `INTEGER NOT NULL`,
                fk: {
                    tabela: `itensVenda`,
                    attr: `id`
                }
            },
            armazem: {
                validacaoQuery: this._validaArmazemQuery,
                validacaoAttr: this._validaArmazemAttr,
                sql: `INTEGER NOT NULL`,
                fk: {
                    tabela: `armazens`,
                    attr: `id`
                }
            }
        })

        this._gerarAtributosJSON = this._gerarAtributosJSON.bind(this)

        this._gerarSchema()
    }

    async _gerarAtributosJSON(objeto, local) {
        const o = await super._gerarAtributosJSON(objeto, local)
        await this._validaCombinacaoUnica({itemVenda: o.itemVenda, armazem: o.armazem}, local)
        if (this.errosValidacao.errors.length > 0) {
            throw new Error("Erros de validação.")
        }
        return o
    }

    async _validaQuantidade(novaQuantidade, local) {
        await this._validaNotNull("quantiade", novaQuantidade, local)
        await this._validaInteiro("quantidade", novaQuantidade, 1, undefined, local)
    }

    async _validaItemVendaQuery(novoItemVenda, local) {
        await this._validaPK("itemVenda", novoItemVenda, local)
    }

    async _validaItemVendaAttr(novoItemVenda, local) {
        await this._validaFK("itemVenda", "itensVenda", novoItemVenda, local)
    }

    async _validaArmazemQuery(novoArmazem, local) {
        await this._validaPK("armazem", "armazens", novoArmazem, local)
    }

    async _validaArmazemAttr(novoArmazem, local) {
        await this._validaFK("armazem", "armazens", novoArmazem, local)
    }

}