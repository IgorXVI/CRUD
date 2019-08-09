const Controller = require("./Controller")
const DAOs = require("../DAOs/DAOs")
const { body } = require("express-validator/check")
module.exports = class VendasController extends Controller {
    constructor() {
        super(`vendas`, `venda`, [
            'funcionario',
            'cliente',
            'listaDeProdutos'
        ], false, new DAOs.VendasDAO())

        super.gerarRotaBuscaTodos()
        super.gerarRotaBuscaUm()
        this.gerarRotaAdicionaUm(super.gerarValidacao(true, ["ValorTotal"]))
        this.gerarRotaAtualizaUm(super.gerarValidacao(false))
        super.gerarRotaDeletaUm()
    }

    gerarRotaAdicionaUm(validacao) {
        const venda  = {
            functionario: 1,
            cliente: 1,
            listaDeProdutos: [
                {
                    produto: 1,
                    quantidade: 10
                }
            ]
        }

        this.router.post(`/${this.nomeSingular}`, validacao, (req, res) => {
            (async () => {
                const estoqueDAO = new DAOs.EstoqueDAO()
                const produtosDAO = new DAOs.ProdutosDAO()
                const itensVendaDAO = new DAOs.ItensVendaDAO()
                try {
                    this.inicio(req, res, `Adicionando ${this.nomeSingular}...`)
                    let objeto = await super.gerarObjeto(req)
                    objeto.valorTotal = 0
                    await this.adicionaUm(req, res, objeto)
                    const item = await itensVendaDAO.buscaPorIDVendaEIDProduto(objeto.idVenda, objeto.idProduto)
                    if (item) {
                        throw new Error("Erro dois itens de venda que possuem o mesmo produto e a mesma venda.")
                    }
                    const estoque = await estoqueDAO.buscaPorIDdeProduto(objeto.idProduto)
                    if (!(estoque && estoque.quantidade >= objeto.quantidade)) {
                        throw new Error("Erro não existem produtos suficientes estocados para realizar essa venda.")
                    }
                    const valorTotal = await this.calculaValorTotal(objeto)
                    objeto.valorTotal = valorTotal
                    await this.masterDAO.adiciona(objeto)
                    await this.atualizaEstoque(objeto)
                    await this.atualizaVenda(objeto)
                    res.status(201).json({})
                    super.fim(req, res)
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
                    super.inicio(req, res, `Atualizando ${this.nomeSingular} com id = ${req.params.id}...`)
                    let objeto = super.gerarObjeto(req)
                    objeto.valorTotal = 0
                    await this.atualizaUm(req, res, objeto)
                } catch (erro) {
                    this.lidarComErro(erro, req, res)
                }
            })()
        })
    }

    gerarRotaDeletaUm() {
        this.router.post(`/${this.nomeSingular}/:id`, validacao, (req, res) => {
            (async () => {
                try {
                    this.inicio(req, res, `Atualizando ${this.nomeSingular} com id = ${req.params.id}...`)
                    let itemBD = {}
                    let objeto = super.gerarObjeto(req)
                    const item = await this.masterDAO.buscaPorID(req.params.id)
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
                    await this.masterDAO.atualizaPorID(objeto, req.params.id)
                    objeto.quantidade -= itemBD.quantidade
                    await this.atualizaEstoque(objeto)
                    objeto.valorTotal -= itemBD.valorTotal
                    await this.atualizaVenda(objeto)
                    res.status(201).json({})
                    super.fim(req, res)
                } catch (erro) {
                    this.lidarComErro(erro, req, res)
                }
            })()
        })


        this.router.delete(`/${this.nomeSingular}/:id`, (req, res) => {
            (async () => {
                try {
                    this.inicio(req, res, `Deletando ${this.nomeSingular} com id = ${req.params.id}...`)
                    let itemBD = {}
                    const item = await this.masterDAO.buscaPorID(req.params.id)
                    if (!item) {
                        throw new Error("Erro no ID.");
                    }
                    itemBD = item
                    await this.masterDAO.deletaPorID(req.params.id)
                    itemBD.quantidade = -itemBD.quantidade
                    await this.atualizaEstoque(itemBD)
                    itemBD.valorTotal = -itemBD.valorTotal
                    await this.atualizaVenda(itemBD)
                    res.status(202).json({})
                    super.fim(req, res)
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

    validaListaDeProdutos(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("listaDeProdutos"))
        }
        validacoes.push(body("listaDeProdutos").custom(lista => {
            if(!(lista instanceof Array)){
                return Promise.reject('O valor deve ser um array.')
            }
            else{
                for(let i = 0; i < lista.length; i++){
                    const objeto = lista[i]
                    try {
                        JSON.parse(JSON.stringify(objeto))
                    } catch (e) {
                        return Promise.reject('O valor deve conter apenas JSONs.')
                    }
                    if(!objeto.produto){
                        return Promise.reject('Todos os JSONs dentro do valor devem ter o atributo produto.')
                    }
                    else if(!objeto.quantidade){
                        return Promise.reject('Todos os JSONs dentro do valor devem ter o atributo quantidade.')
                    }
                    else {
                        const produtosDAO = new DAOs.ProdutosDAO()
                        return produtosDAO.buscaPorID(objeto.produto).then(o => {
                            if (!o) {
                                return Promise.reject(`O produto informado no objeto com index = ${i} não está cadastrado.`);
                            }
                            else {
                                const estoqueDAO = new DAOs.EstoqueDAO()
                                return estoqueDAO.buscaPorIDdeProduto(objeto.produto).then(est => {
                                    if (!(est && est.quantidade >= objeto.quantidade)) {
                                        return Promise.reject(`O produto informado no objeto com index = ${i} não possui quantidade suficiente no estoque para realizar essa venda.`);
                                    }
                                })
                            }
                        })
                    }
                }
            }
        }).optional())
        return validacoes
    }

    validaFuncionario(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("funcionario"))
        }
        validacoes.push(this.validaInteiro("funcionario", 1))
        validacoes.push(body("funcionario").custom(id => {
            return (async () => {
                const funcionariosDAO = new DAOs.FuncionariosDAO()
                const objeto = await funcionariosDAO.buscaPorID(id)
                if (!objeto) {
                    throw new Error(`O valor informado não está cadastrado.`);
                }
            })()
        }).optional())
        return validacoes
    }

    validaCliente(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("cliente"))
        }
        validacoes.push(this.validaInteiro("cliente", 1).optional())
        validacoes.push(body("cliente").custom(id => {
            return (async () => {
                const clientesDAO = new DAOs.CidadesDAO()
                const objeto = await clientesDAO.buscaPorID(id)
                if (!objeto) {
                    throw new Error(`O valor informado não está cadastrado.`);
                }
            })()
        }).optional())
        return validacoes
    }

}