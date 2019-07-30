const Controller = require("./Controller")

module.exports = class ItensVendaController extends Controller {
    constructor() {
        super(`itens-venda`, `item`, [ 'valorTotal',
        'quantidade',
        'idProduto',
        'idVenda',
        'dataAlteracao',
        'dataCriacao' ], false)

        this.masterDAO = this.itensVendaDAO

        super.gerarRotaBuscaTodos()
        super.gerarRotaBuscaUm()
        this.gerarRotaAdicionaUm(super.gerarValidacao(true, ["valorTotal"]))
        this.gerarRotaAtualizaUm(super.gerarValidacao(false, ["quantidade"]))
        this.gerarRotaDeletaUm()
    }

    gerarRotaAdicionaUm(validacao) {
        this.router.post(`/${this.nomeSingular}`, validacao, (req, res) => {
            if (this.inicio(req, res, `Adicionando ${this.nomeSingular}...`)) {
                return
            }

            let objeto = super.gerarObjeto(req)

            this.itensVendaDAO.buscaoPorIDVendaEIDProduto(objeto.idVenda, objeto.idProduto)
                .then(
                    (resultado) => {
                        if (resultado) {
                            const erro = [{
                                location: "body",
                                param: "idProduto, idVenda",
                                msg: "Não podem existir dois itens de venda que possuem o mesmo produto e a mesma venda.",
                                value: [req.body.idVenda, req.body.idProduto]
                            }]
                            res.status(400).json({
                                erro
                            })
                            super.fim()
                            return
                        } else {
                            return this.estoqueDAO.buscaPorIDdeProduto(objeto.idProduto)
                        }
                    }
                )
                .then(
                    (estoque) => {
                        if (estoque && estoque.quantidade >= objeto.quantidade) {
                            return this.calculaValorTotal(objeto)
                        } else {
                            const erro = [{
                                location: "body",
                                param: "idProduto",
                                msg: "Não existem produtos suficientes estocados para realizar essa venda.",
                                value: req.body.idProduto
                            }]
                            res.status(400).json({
                                erro
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
                            return this.itensVendaDAO.adiciona(objeto)
                        } else {
                            return "fim"
                        }
                    }
                )
                .then(
                    (retorno) => {
                        if (retorno != "fim") {
                            return this.atualizaEstoque(objeto)
                        } else {
                            return "fim"
                        }
                    }
                )
                .then(
                    (retorno) => {
                        if (retorno != "fim") {
                            return this.atualizaVenda(objeto)
                        } else {
                            return "fim"
                        }
                    }
                )
                .then(
                    (retorno) => {
                        if (retorno != "fim") {
                            res.status(201).end()
                            super.fim()
                        }
                    }
                )
                .catch(
                    (erro) => {
                        super.erroServidor(erro)
                    }
                )
        })
    }

    gerarRotaAtualizaUm(validacao) {
        this.router.post(`/${this.nomeSingular}/:id`, validacao, (req, res) => {
            if (this.inicio(req, res, `Atualizando ${this.nomeSingular} com id = ${req.params.id}...`)) {
                return
            }

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
        })
    }

    gerarRotaDeletaUm() {
        this.router.delete(`/${this.nomeSingular}/:id`, (req, res) => {
            if (this.inicio(req, res, `Deletando ${this.nomeSingular} com id = ${req.params.id}...`)) {
                return
            }

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
        })
    }

    calculaValorTotal(objeto) {

        return new Promise((resolve, reject) => {
            this.produtosDAO.buscaPorID(objeto.idProduto)
                .then(
                    (produto) => {
                        resolve(produto.precoUnidade * objeto.quantidade)
                    }
                )
                .catch(
                    (erro) => {
                        reject(new Error(erro))
                    }
                )
        })

    }

    atualizaVenda(objeto) {

        return new Promise((resolve, reject) => {
            this.vendasDAO.buscaPorID(objeto.idVenda)
                .then(
                    (venda) => {
                        venda.valorTotal += objeto.valorTotal
                        const id = venda.id

                        delete venda.id
                        delete venda.dataCriacao

                        venda.dataAlteracao = super.dataDeHoje()

                        return this.vendasDAO.atualizaPorID(venda, id)
                    }
                )
                .then(
                    () => {
                        resolve()
                    }
                )
                .catch(
                    (erro) => {
                        reject(new Error(erro))
                    }
                )
        })

    }

    atualizaEstoque(objeto) {
        return new Promise((resolve, reject) => {
            this.estoqueDAO.buscaPorIDdeProduto(objeto.idProduto)
                .then(
                    (estoque) => {
                        estoque.quantidade -= objeto.quantidade
                        const id = estoque.id

                        delete estoque.id
                        delete estoque.dataCriacao

                        estoque.dataAlteracao = super.dataDeHoje()

                        return this.estoqueDAO.atualizaPorID(estoque, id)
                    }
                )
                .then(
                    () => {
                        resolve()
                    }
                )
                .catch(
                    (erro) => {
                        reject(new Error(erro))
                    }
                )
        })
    }

}