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

        this._gerarSchema()
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