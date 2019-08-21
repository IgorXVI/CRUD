const Model = require("./Model")
const DAO = require("../database/DAO")

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

        const estoqueDAO = new DAO("estoque")
        const listaEstoque = estoqueDAO.busca({
            produto: o.produto
        })
        const quantidadeNoEstoque = listaEstoque.reduce((acumulador, valorAtual) => {
            acumulador + valorAtual.quantidade
        }, 0)
        if (quantidadeNoEstoque < o.quantiade) {
            await this._adicionaErroValidacao(["produto", "quantidade"], [o.produto, o.quantidade], "Não existem produtos suficientes estocados para realizar essa venda.", local)
        }

        await this._validaCombinacaoUnica({
            venda: o.venda,
            produto: o.produto
        }, local)

        if (this.errosValidacao.errors.length > 0) {
            throw new Error("Erros de validação.")
        }

        const produtosDAO = new DAO("produtos")
        const produtoPrecoUnidade = ( produtosDAO.busca({
            id: o.produto
        }) )[0].precoUnidade
        o.valorTotal = produtoPrecoUnidade * o.quantiade

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