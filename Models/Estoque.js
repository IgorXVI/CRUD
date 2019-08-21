const Model = require("./Model")
module.exports = class Estoque extends Model {
    constructor() {
        super("itemEstocado", "estoque")

        Object.assign(this.attrs, {
            quantidade: {
                validacao: this._validaQuantidade,
                sql: `INTEGER NOT NULL`
            },
            produto: {
                validacaoQuery:  this._validaProdutoQuery,
                validacaoAttr:  this._validaProdutoAttr,
                sql: `INTEGER NOT NULL`,
                fk: {
                    tabela: `produtos`,
                    attr: `id`
                }
            },
            armazem: {
                validacaoQuery:  this._validaArmazemQuery,
                validacaoAttr:  this._validaArmazemAttr,
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
        await this._validaCombinacaoUnica({armazem: o.armazem, produto: o.produto}, local)
        if (this.errosValidacao.errors.length > 0) {
            throw new Error("Erros de validação.")
        }
        return o
    }

    async _validaQuantidade(novaQuantidade, local) {
        await this._validaNotNull("quantidade", novaQuantidade, local)
        await this._validaInteiro("quantidade", novaQuantidade, 0, undefined, local)
    }

    async _validaProdutoQuery(novoProduto, local) {
        await this._validaPK("produto", novoProduto, local)
    }

    async _validaProdutoAttr(novoProduto, local) {
        await this._validaFK("produto", "produtos", novoProduto, local)
    }

    async _validaArmazemQuery(novoArmazem, local) {
        await this._validaPK("armazem", novoArmazem, local)
    }

    async _validaArmazemAttr(novoArmazem, local) {
        await this._validaFK("armazem", "armazens", novoArmazem, local)
    }

}