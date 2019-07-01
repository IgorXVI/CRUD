const Controller = require("./Controller")

module.exports = class ItensVendaController extends Controller {
    constructor() {
        super(`itens-venda`, `item`, `valorTotal, quantidade, idProduto, idVenda, dataAlteracao, dataCriacao`, false)

        this.masterDAO = this.itensVendaDAO

        super.gerarRotaBuscaTodos()
        super.gerarRotaBuscaUm()
        this.gerarRotaAdicionaUm(super.gerarValidacao(true, ["ValorTotal"]))
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
                                param: "idVenda, idProduto",
                                msg: "Não podem existir dois itens de venda que possuem o mesmo produto e a mesma venda.",
                                value: [req.body.idVenda, req.body.idProduto]
                            }]
                            res.status(400).json({
                                erro
                            })
                            super.fim()
                            return
                        } else {
                            return this.produtosSuficientesEstocados(objeto)
                        }
                    }
                )
                .then(
                    (existem) => {
                        if (!existem) {
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
                        } else {
                            return this.calculaValorTotal(objeto)
                        }
                    }
                )
                .then(
                    (valorTotal) => {
                        if (valorTotal != "fim") {
                            objeto.valorTotal = valorTotal
                            return this.atualizaVenda(objeto)
                        } else {
                            return "fim"
                        }
                    }
                )
                .then(
                    (retorno) => {
                        if (retorno != "fim") {
                            super.adicionaUm(req, res, objeto)
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
            objeto.idVenda = undefined
            objeto.idProduto = undefined

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
                            return
                        } else {
                            itemBD = item
                            return this.roolbackEstoque(itemBD)
                        }
                    }
                )
                .then(
                    () => {
                        return this.roolbackVenda(itemBD)
                    }
                )
                .then(
                    () => {
                        return this.produtosSuficientesEstocados(objeto)
                    }
                )
                .then(
                    (existem) => {
                        if (!existem) {
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
                            return
                        } else {
                            return this.calculaValorTotal(objeto)
                        }
                    }
                )
                .then(
                    (valorTotal) => {
                        objeto.valorTotal = valorTotal
                        return this.atualizaVenda(objeto)
                    }
                )
                .then(
                    () => {
                        super.atualizaUm(req, res, objeto)
                    }
                )
                .catch(
                    (erro) => {
                        super.erroServidor(erro)
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
                            return
                        } else {
                            itemBD = item
                            return this.roolbackEstoque(itemBD)
                        }
                    }
                )
                .then(
                    () => {
                        return this.roolbackVenda(itemBD)
                    }
                )
                .then(
                    () => {
                        super.deletaUm(req, res)
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

    produtosSuficientesEstocados(objeto) {

        return new Promise((resolve, reject) => {
            this.estoqueDAO.buscaPorIDdeProduto(objeto.idProduto)
                .then(
                    (estoque) => {
                        if (estoque && estoque.quantidade >= objeto.quantidade) {
                            estoque.quantidade = estoque.quantidade - objeto.quantidade
                            const id = estoque.id

                            delete estoque.id
                            delete estoque.dataCriacao

                            return this.estoqueDAO.atualizaPorID(estoque, id)
                        } else {
                            resolve(false)
                            return "fim"
                        }
                    }
                )
                .then(
                    (retorno) => {
                        if (retorno != "fim") {
                            resolve(true)
                        }
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

    roolbackEstoque(objeto) {
        return new Promise((resolve, reject) => {
            this.estoqueDAO.buscaPorIDdeProduto(objeto.idProduto)
                .then(
                    (estoque) => {
                        estoque.quantidade = estoque.quantidade + objeto.quantidade
                        const id = estoque.id

                        delete estoque.id
                        delete estoque.dataCriacao

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

    roolbackVenda(objeto) {
        return new Promise((resolve, reject) => {
            this.vendasDAO.buscaPorID(objeto.idVenda)
                .then(
                    (venda) => {
                        venda.valorTotal -= objeto.valorTotal
                        const id = venda.id

                        delete venda.id
                        delete venda.dataCriacao

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

}