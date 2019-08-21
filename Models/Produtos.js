const Model = require("./Model")
const DAO = require("../database/DAO")

module.exports = class Produtos extends Model {
    constructor() {
        super("produto", "produtos")

        Object.assign(this.attrs, {
            nome: {
                validacao: this._validaNome,
                sql: `TEXT NOT NULL UNIQUE`
            },
            categoria: {
                validacao: this._validaCategoria,
                sql: `TEXT NOT NULL`
            },
            precoUnidade: {
                validacao: this._validaPrecoUnidade,
                sql: `REAL NOT NULL`
            },
            descricao: {
                validacao: this._validaDescricao,
                sql: `TEXT NOT NULL`
            },
            garantia: {
                validacao: this._validaGarantia,
                sql: `INTEGER NOT NULL`
            },
            dataFabricacao: {
                validacao: this._validaDataFabricacao,
                sql: `VARCHAR(10) NOT NULL`
            },
            dataValidade: {
                validacao: this._validaDataValidade,
                sql: `VARCHAR(10) NOT NULL`
            },
            fornecedor: {
                validacaoQuery: this._validaFornecedorQuery,
                validacaoAttr: this._validaFornecedorAttr,
                sql: `INTEGER NOT NULL`,
                fk: {
                    tabela: `fornecedores`,
                    attr: `id`
                }
            }
        })

        this._converterForeignKeyEmJSON = this._converterForeignKeyEmJSON.bind(this)

        this._gerarSchema()
    }

    async _converterForeignKeyEmJSON(objeto) {
        let o = await super._converterForeignKeyEmJSON(objeto)

        const estoqueDAO = new DAO("estoque")
        const listaEstoque = estoqueDAO.busca({
            produto: o.id
        })
        o.quantidadeNoEstoque = listaEstoque.reduce((acumulador, valorAtual) => {
            acumulador + valorAtual.quantidade
        }, 0)

        return o
    }

    async _validaNome(novoNome, local) {
        await this._validaNotNull("nome", novoNome, local)
        await this._validaMinMaxChars("nome", novoNome, 1, 100, local)
        await this._validaCampoUnico("nome", novoNome, local)
    }

    async _validaCategoria(novaCategoria, local) {
        await this._validaNotNull("categoria", novaCategoria, local)
        await this._validaMaxChars("categoria", novaCategoria, 100, local)
    }

    async _validaPrecoUnidade(novoPrecoUnidade, local) {
        await this._validaNotNull("precoUnidade", novoPrecoUnidade, local)
        await this._validaDecimal("precoUnidade", novoPrecoUnidade, 0, undefined, local)
    }

    async _validaDescricao(novaDescricao, local) {
        await this._validaNotNull("descricao", novaDescricao, local)
        await this._validaMaxChars("descricao", novaDescricao, 255, local)
    }

    async _validaGarantia(novaGarantia, local) {
        await this._validaNotNull("garantia", novaGarantia, local)
        await this._validaInteiro("garantia", novaGarantia, 0, undefined, local)
    }

    async _validaDataFabricacao(novaDataFabricacao, local) {
        await this._validaNotNull("dataFabricacao", novaDataFabricacao, local)
        await this._validaDataISO8601("dataFabricacao", novaDataFabricacao, local)
    }

    async _validaDataValidade(novaDataValidade, local) {
        await this._validaNotNull("dataValidade", novaDataValidade, local)
        await this._validaDataISO8601("dataValidade", novaDataValidade, local)
    }

    async _validaFornecedorQuery(novoFornecedor, local) {
        await this._validaPK("fornecedor", novoFornecedor, local)
    }

    async _validaFornecedorAttr(novoFornecedor, local) {
        await this._validaFK("fornecedor", "fornecedores", novoFornecedor, local)
    }

}