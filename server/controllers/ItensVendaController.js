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

        this.masterDAO = this.itensVendaDAO

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
                    async function zovo() {
                        setTimeout(function () {
                            console.log(zovo)
                        }, 3000)
                    }
                    await zovo()

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
                    this.lidarComErro(erro, res)
                }
            })()
        })
    }

    gerarRotaAtualizaUm(validacao) {
        this.router.post(`/${this.nomeSingular}/:id`, validacao, (req, res) => {
            if (this.inicio(req, res, `Atualizando ${this.nomeSingular} com id = ${req.params.id}...`)) {
                let objeto = this.gerarObjeto(req)

                let itemBD = {}

                this.itensVendaDAO.buscaPorID(req.params.id)
                    .then(
                        (item) => {
                            if (!item) {
                                const erro1 = [{
                                    location: "params",
                                    param: "id",
                                    msg: "O valor informado não é válido.",
                                    value: req.params.id
                                }]
                                res.status(400).json({
                                    erro: erro1
                                })
                                this.fim()
                                return "fim"
                            } else {
                                itemBD = item
                                objeto.idProduto = itemBD.idProduto
                                objeto.idVenda = itemBD.idVenda
                                delete objeto.dataCriacao
                                return this.estoqueDAO.buscaPorIDdeProduto(objeto.idProduto)
                            }
                        }
                    )
                    .then(
                        (estoque) => {
                            if (estoque && (estoque.quantidade + itemBD.quantidade) >= objeto.quantidade) {
                                return this.calculaValorTotal(objeto)
                            } else {
                                const erro2 = [{
                                    location: "body",
                                    param: "idProduto",
                                    msg: "Não existem produtos suficientes estocados para realizar essa venda.",
                                    value: req.body.idProduto
                                }]
                                res.status(400).json({
                                    erro: erro2
                                })
                                super.fim()
                                return "fim"
                            }
                        }
                    )
                    .then(
                        (valorTotal) => {
                            if (valorTotal != "fim") {
                                objeto.valorTotal = valorTotal
                                return this.itensVendaDAO.atualizaPorID(objeto, req.params.id)
                            } else {
                                return "fim"
                            }
                        }
                    )
                    .then(
                        (retorno) => {
                            if (retorno != "fim") {
                                objeto.quantidade -= itemBD.quantidade
                                return this.atualizaEstoque(objeto)
                            } else {
                                return "fim"
                            }
                        }
                    )
                    .then(
                        (retorno) => {
                            if (retorno !== "fim") {
                                objeto.valorTotal -= itemBD.valorTotal
                                return this.atualizaVenda(objeto)
                            } else {
                                return "fim"
                            }
                        }
                    )
                    .then(
                        (retorno) => {
                            if (retorno != "fim") {
                                console.log("passou o atualizaVenda")
                                res.status(201).end()
                                this.fim()
                            }
                        }
                    )
                    .catch(
                        (error) => {
                            super.erroServidor(error)
                        }
                    )
            }
        })
    }

    gerarRotaDeletaUm() {
        this.router.delete(`/${this.nomeSingular}/:id`, (req, res) => {
            if (this.inicio(req, res, `Deletando ${this.nomeSingular} com id = ${req.params.id}...`)) {
                let itemBD = {}

                this.itensVendaDAO.buscaPorID(req.params.id)
                    .then(
                        (item) => {
                            if (!item) {
                                const erro = [{
                                    location: "params",
                                    param: "id",
                                    msg: "O valor informado não é válido.",
                                    value: req.params.id
                                }]
                                res.status(400).json({
                                    erro
                                })
                                this.fim()
                                return "fim"
                            } else {
                                itemBD = item
                                return this.itensVendaDAO.deletaPorID(req.params.id)
                            }
                        }
                    )
                    .then(
                        (retorno) => {
                            if (retorno != "fim") {
                                itemBD.quantidade = -itemBD.quantidade
                                return this.atualizaEstoque(itemBD)
                            } else {
                                return "fim"
                            }
                        }
                    )
                    .then(
                        (retorno) => {
                            if (retorno !== "fim") {
                                itemBD.valorTotal = -itemBD.valorTotal
                                return this.atualizaVenda(itemBD)
                            } else {
                                return "fim"
                            }
                        }
                    )
                    .then(
                        (retorno) => {
                            if (retorno != "fim") {
                                res.status(202).end()
                                this.fim()
                            }
                        }
                    )
                    .catch(
                        (erro) => {
                            if (erro.message.includes("SQLITE_CONSTRAINT: FOREIGN KEY constraint failed")) {
                                const erro = [{
                                    location: "params",
                                    param: "id",
                                    msg: "O valor informado está sendo usado como foreign key.",
                                    value: req.params.id
                                }]
                                res.status(400).json({
                                    erro
                                })
                                this.fim()
                            } else {
                                this.erroServidor()
                            }
                        }
                    )
            }
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