const Controller = require("./Controller")

module.exports = class ItensVendaController extends Controller {
    constructor() {
        super(`itens-venda`, `item`, `valorTotal, quantidade, produto, idVenda, dataAlteracao, dataCriacao`, false)

        this.masterDAO = this.itensVendaDAO

        super.gerarRotaBuscaTodos()
        super.gerarRotaBuscaUm()
        this.gerarRotaAdicionaUm(super.gerarValidacao(true, ["ValorTotal"]))
        super.gerarRotaDeletaUm()
    }

    gerarRotaAdicionaUm(validacao) {
        this.router.post(`/${this.nomeSingular}`, validacao, (req, res) => {
            if (this.inicio(req, res, `Adicionando ${this.nomeSingular}...`)) {
                return
            }

            let objeto = super.gerarObjeto(req)

            this.produtosSuficientesEstocados(objeto)
                .then(
                    (existem) => {
                        if (!existem) {
                            res.status(400).json({
                                success: false,
                                erro: "Não existem produtos suficientes estocados para realizar essa venda."
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
                        super.adicionaUm(req, res, objeto)
                    }
                )
                .catch(
                    (erro) => {
                        super.erroServidor(erro)
                    }
                )
        })
    }

    calculaValorTotal(objeto) {

        return new Promise((resolve, reject) => {
            this.produtosDAO.buscaPorID(objeto.produto)
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
            this.estoqueDAO.buscaPorIDdeProduto(objeto.produto)
                .then(
                    (estoque) => {
                        if (estoque && estoque.quantidade <= objeto.quantidade) {
                            estoque.quantidade -= objeto.quantidade
                            const id = estoque.id
                            delete estoque.id
                            return this.estoqueDAO.atualizaPorID(estoque, id)
                        }
                        resolve(false)
                        return
                    }
                )
                .then(
                    () => {
                        resolve(true)
                        return
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