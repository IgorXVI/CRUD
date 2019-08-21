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
                validacao: this._validaProduto,
                sql: `INTEGER NOT NULL`,
                fk: {
                    tabela: `produtos`,
                    attr: `id`
                }
            },
            armazem: {
                validacao: this._validaArmazem,
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

    async _validaProduto(novoProduto, local) {
        await this._validaFK("produto", "produtos", novoProduto, local)
    }

    async _validaArmazem(novoArmazem, local) {
        await this._validaFK("armazem", "armazens", novoArmazem, local)
    }

}