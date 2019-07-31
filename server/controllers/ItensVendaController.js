const Controller = require("./Controller")

module.exports = class ItensVendaController extends Controller {
    constructor() {
        super(`itens-venda`, `item`, ['valorTotal',
            'quantidade',
            'idProduto',
            'idVenda',
            'dataAlteracao',
            'dataCriacao'
        ], false)

        super.gerarRotaBuscaTodos()
        super.gerarRotaBuscaUm()
        this.gerarRotaAdicionaUm(super.gerarValidacao(true, ["valorTotal"]))
        this.gerarRotaAtualizaUm(super.gerarValidacao(false, ["quantidade"]))
        this.gerarRotaDeletaUm()
    }

    gerarRotaAdicionaUm(validacao) {
        this.router.post(`/${this.nomeSingular}`, validacao, (req, res) => {
            (async () => {
                try {
                    this.inicio(req, res, `Adicionando ${this.nomeSingular}...`)
                    let objeto = super.gerarObjeto(req)
                    const item = await this.itensVendaDAO.buscaPorIDVendaEIDProduto(objeto.idVenda, objeto.idProduto)
                    if (item) {
                        throw new Error("Erro dois itens de venda que possuem o mesmo produto e a mesma venda.")
                    }
                    const estoque = await this.estoqueDAO.buscaPorIDdeProduto(objeto.idProduto)
                    if (!(estoque && estoque.quantidade >= objeto.quantidade)) {
                        throw new Error("Erro não existem produtos suficientes estocados para realizar essa venda.")
                    }
                    const valorTotal = await this.calculaValorTotal(objeto)
                    objeto.valorTotal = valorTotal
                    await this.itensVendaDAO.adiciona(objeto)
                    await this.atualizaEstoque(objeto)
                    await this.atualizaVenda(objeto)
                    res.status(201).end()
                    super.fim()
                } catch (erro) {
                    this.lidarComErro(erro, req, res)
                }
            })()
        })
    }

    gerarRotaAtualizaUm(validacao) {
        this.router.post(`/${this.nomeSingular}/:id`, validacao, (req, res) => {
            (async () => {
                try {
                    this.inicio(req, res, `Atualizando ${this.nomeSingular} com id = ${req.params.id}...`)
                    let itemBD = {}
                    let objeto = super.gerarObjeto(req)
                    const item = await this.itensVendaDAO.buscaPorID(req.params.id)
                    if (!item) {
                        throw new Error("Erro no ID.");
                    }
                    itemBD = item
                    objeto.idProduto = itemBD.idProduto
                    objeto.idVenda = itemBD.idVenda
                    delete objeto.dataCriacao
                    const estoque = await this.estoqueDAO.buscaPorIDdeProduto(objeto.idProduto)
                    if (!(estoque && (estoque.quantidade + itemBD.quantidade) >= objeto.quantidade)) {
                        throw new Error("Erro não existem produtos suficientes estocados para realizar essa venda.")
                    }
                    const valorTotal = await this.calculaValorTotal(objeto)
                    objeto.valorTotal = valorTotal
                    await this.itensVendaDAO.atualizaPorID(objeto, req.params.id)
                    objeto.quantidade -= itemBD.quantidade
                    await this.atualizaEstoque(objeto)
                    objeto.valorTotal -= itemBD.valorTotal
                    await this.atualizaVenda(objeto)
                    res.status(201).end()
                    super.fim()
                } catch (erro) {
                    this.lidarComErro(erro, req, res)
                }
            })()
        })
    }

    gerarRotaDeletaUm() {
        this.router.delete(`/${this.nomeSingular}/:id`, (req, res) => {
            (async () => {
                try {
                    this.inicio(req, res, `Deletando ${this.nomeSingular} com id = ${req.params.id}...`)
                    let itemBD = {}
                    const item = await this.itensVendaDAO.buscaPorID(req.params.id)
                    if (!item) {
                        throw new Error("Erro no ID.");
                    }
                    itemBD = item
                    await this.itensVendaDAO.deletaPorID(req.params.id)
                    itemBD.quantidade = -itemBD.quantidade
                    await this.atualizaEstoque(itemBD)
                    itemBD.valorTotal = -itemBD.valorTotal
                    await this.atualizaVenda(itemBD)
                    res.status(202).end()
                    super.fim()
                } catch (erro) {
                    this.lidarComErro(erro, req, res)
                }
            })()
        })
    }

    async calculaValorTotal(objeto) {
        const produto = await this.produtosDAO.buscaPorID(objeto.idProduto)
        return produto.precoUnidade * objeto.quantidade
    }

    async atualizaVenda(objeto) {
        let venda = await this.vendasDAO.buscaPorID(objeto.idVenda)
        venda.valorTotal += objeto.valorTotal
        const id = venda.id

        delete venda.id
        delete venda.dataCriacao

        venda.dataAlteracao = super.dataDeHoje()

        await this.vendasDAO.atualizaPorID(venda, id)
    }

    async atualizaEstoque(objeto) {
        let estoque = await this.estoqueDAO.buscaPorIDdeProduto(objeto.idProduto)
        estoque.quantidade -= objeto.quantidade
        const id = estoque.id

        delete estoque.id
        delete estoque.dataCriacao

        estoque.dataAlteracao = super.dataDeHoje()

        await this.estoqueDAO.atualizaPorID(estoque, id)
    }

}