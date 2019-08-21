const ErrorHelper = require("../Helpers/ErrorHelper")

const log = require('log-to-file')

const Controller = require("./Controller")

const Vendas = require("../Models/Vendas")
const ItensVenda = require("../Models/ItensVenda")
const Transportes = require("../Models/Transportes")
const Produtos = require("../Models/Produtos")
const Estoque = require("../Models/Estoque")

module.exports = class VendasController extends Controller {
    constructor() {
        super(new Vendas(), true)

        this.itensVenda = new ItensVenda()
        this.transportes = new Transportes()
        this.produtos = new Produtos()
        this.estoque = new Estoque()

        this.gerarRotaDeletaUm()
        this.gerarRotaAdicionaUm()
        this.gerarRotaAdionaUmItem()
    }

    gerarRotaAdicionaUm() {
        this.router.post(`${this.proxy}/${this.nomePlural}/${this.nomeSingular}`, async (req, res) => {
            try {
                this.inicio(req, res, `Adicionando ${this.nomeSingular}...`)

                req.body.valorTotal = 0
                const resultado = await this.model.adicionaUm(req.body)
                res.status(200).json(resultado)

                this.fim(req, res)
            } catch (erro) {
                await this.lidarComErro(erro, req, res)
            }
        })
    }

    gerarRotaAdionaUmItem() {
        this.router.post(`${this.proxy}/${this.nomePlural}/${this.nomeSingular}/:id/${this.itensVenda.nomePlural}/${this.itensVenda.nomeSingular}`, async (req, res) => {
            try {
                this.inicio(req, res, `Adicionando ${this.itensVenda.nomeSingular} para ${this.nomeSingular} com id = ${req.params.id}...`)

                let venda = await this.model.buscaUm(req.params.id)
                delete venda.id
                
                const item = await this.gerarItemVenda(req.body, req.params.id)
                await this.itensVenda.adicionaUm(item)

                venda.valorTotal += item.valorTotal
                await this.model.atualizaUm(venda, req.params.id)
                
                venda.itensVenda = await this.itensVenda.busca({venda: req.params.id})

                res.status(200).json(venda)

                this.fim(req, res)
            } catch (erro) {
                await this.lidarComErro(erro, req, res)
            }
        })
    }

    async lidarComErro(erro, req, res) {
        const errorHelper = new ErrorHelper()
        if (erro.message.includes("Erros de validação.")) {
            if (this.itensVenda.errosValidacao.errors.length > 0) {
                res.status(400).json(await this.itensVenda.pegarErrosValidacao())
            } else if (this.transportes.errosValidacao.errors.length > 0) {
                res.status(400).json(await this.transportes.pegarErrosValidacao())
            } else {
                res.status(400).json(await this.model.pegarErrosValidacao())
            }
        } else {
            console.log(erro)
            log(erro)
            res.status(500).json(await errorHelper.formatError(undefined, undefined, "Erro no servidor."))
        }
        this.fim(req, res)
    }

    async gerarItemVenda(item, idVenda){
        let i = JSON.parse(JSON.stringify(item))

        const produto = await this.produtos.buscaUm(i.produto)

        if(produto.quantidadeNoEstoque < i.quantidade){
            await this.itensVenda.umErroValidacao(["produto", "quantidade"], [i.produto, i.quantidade], "Não existem produtos suficientes estocados para realizar essa venda.", "req.body")
        }

        i.valorTotal = produto.precoUnidade * i.quantidade
        i.venda = idVenda

        return i
    }

    async validaItensVenda(itens){
        let novosItensVenda2 = []
        let valorTotal = 0
        let estLista = []
        for (let i = 0; i < novosItensVenda.length; i++) {
            let o = JSON.parse(JSON.stringify(novosItensVenda[i]))

            o.valorTotal = o.produto.precoUnidade * o.quantidade
            valorTotal += o.valorTotal

            let estoques = await estoqueDAO.buscaTodosPorColuna(o.produto.id, "produto")
            if (estoques.length) {
                let estoquesQuantidade = 0

                let estoques2 = []
                for (let j = 0; j < estoques.length; j++) {
                    let est = estoques[j]
                    est.cidade = await cidadesDAO.buscaPorColuna(est.cidade, "id")
                    const latEstoque = est.cidade.latitude
                    const lonEstoque = est.cidade.longitude
                    const latCliente = this.clienteCidade.latitude
                    const lonCliente = this.clienteCidade.longitude
                    est.distanciaDoCliente = await this._distanciaEntreCoordenadas(latEstoque, lonEstoque, latCliente, lonCliente)
                    if (est.quantidade > 0) {
                        estoquesQuantidade += est.quantidade
                        estoques2.push(est)
                    }
                }

                if (estoquesQuantidade < o.quantidade) {
                    throw new Error(await this._formataErro(`itensVenda, index: ${i}`, JSON.stringify(novosItensVenda[i]), `O produto informado não possui quantidade suficiente no estoque para realizar essa venda.`))
                }

                estoques = estoques2.sort((a, b) => a.distanciaDoCliente - b.distanciaDoCliente)

                estoquesQuantidade = 0
                for (let j = 0; j < estoques.length; j++) {
                    let est = estoques[j]

                    let diferenca = o.quantidade - estoquesQuantidade
                    if(est.quantidade >= diferenca){
                        estoquesQuantidade = o.quantidade
                        est.quantidade -= diferenca
                        est.quantidadeTransporte = diferenca
                    }
                    else{
                        estoquesQuantidade += est.quantidade
                        est.quantidadeTransporte = est.quantidade
                        est.quantidade = 0
                    }

                    delete est.distanciaDoCliente
                    estLista.push(est)

                    if(estoquesQuantidade === o.quantidade){
                        break
                    }
                }
            }

            novosItensVenda2.push(o)
        }
        return {
            itens: novosItensVenda2,
            listaEstoque: estLista,
            valorTotal
        }
    }

    async adicionaUm(objeto) {
        const itensVendaDAO = new DAO("itensVenda")
        const estoqueDAO = new DAO("estoque")
        const transportesDAO = new DAO("transportes")

        let json = await this._gerarAtributosJSON(objeto)

        const itens = json.itensVenda.itens
        const listaEstoque = json.itensVenda.listaEstoque
        const valorTotal = json.itensVenda.valorTotal

        let venda = {
            valorTotal,
            funcionario: json.funcionario,
            cliente: json.cliente
        }

        const vendaId = (await this._DAO.adiciona(venda)).lastInsertRowid

        for (let i = 0; i < itens.length; i++) {
            let o = itens[i]
            let item = {
                valorTotal: o.valorTotal,
                quantidade: o.quantidade,
                produto: o.produto.id,
                venda: vendaId
            }

            const itemId = (await itensVendaDAO.adiciona(item)).lastInsertRowid
            for (let j = 0; j < listaEstoque.length; j++) {
                let est = JSON.parse(JSON.stringify(listaEstoque[j]))

                const transporte = {
                    estoque: est.id,
                    itemVenda: itemId,
                    quantidade: est.quantidadeTransporte
                }
                await transportesDAO.adiciona(transporte)

                delete est.quantidadeTransporte
                est.cidade = est.cidade.id
                await estoqueDAO.atualizaPorColuna(est, "id")
            }

        }
    }

    async _distanciaEntreCoordenadas(lat1, lon1, lat2, lon2) {
        const RaioTerra = 6371
        const omega1 = lat1 * (Math.PI / 180)
        const omega2 = lat2 * (Math.PI / 180)
        const omegaD = (lat2 - lat1) * (Math.PI / 180)
        const lambdaD = (lon2 - lon1) * (Math.PI / 180)

        const a = Math.pow(Math.sin(omegaD / 2), 2) + Math.cos(omega1) + Math.cos(omega2) + Math.pow(Math.sin(lambdaD / 2), 2)

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

        const d = RaioTerra * c

        return d
    }

}