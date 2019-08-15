const Vendas = require("../Models/Vendas")
const Controller = require("./Controller")

module.exports = class VendasController extends Controller {
    constructor(){
        super(Vendas, true)

        this.gerarRotaAdicionaUm()
        this.gerarRotaBusca()
        this.gerarRotaBuscaUm()
        this.gerarRotaDeletaUm()
    }

    //backup do controle de estoque
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

    async itensVenda(novosItensVenda) {
        const produtosDAO = new DAO("produtos")
        const estoqueDAO = new DAO("estoque")
        const cidadesDAO = new DAO("cidades")

        let novosItensVenda2 = []
        let IDsDeProdutos = []
        let valorTotal = 0
        let estLista = []
        await this._validaArray("itensVenda", novosItensVenda)
        for (let i = 0; i < novosItensVenda.length; i++) {
            let o = JSON.parse(JSON.stringify(novosItensVenda[i]))
            if (!o.produto) {
                throw new Error(await this._formataErro(`itensVenda, index: ${i}`, JSON.stringify(novosItensVenda[i]), "Todos os JSONs dentro do valor devem ter o atributo produto."))
            }
            if (!o.quantidade) {
                throw new Error(await this._formataErro(`itensVenda, index: ${i}`, JSON.stringify(novosItensVenda[i]), "Todos os JSONs dentro do valor devem ter o atributo quantidade."))
            }

            await this._validaInteiro(`itensVenda, index: ${i}`, o.produto, 1)
            await this._validaInteiro(`itensVenda, index: ${i}`, o.quantidade, 1)

            const produto = await produtosDAO.buscaPorColuna(o.produto, "id")
            if (!produto) {
                throw new Error(await this._formataErro(`itensVenda, index: ${i}`, JSON.stringify(novosItensVenda[i]), "O produto informado não está cadastrado."))
            }

            if (IDsDeProdutos.includes(produto.id)) {
                throw new Error(await this._formataErro(`itensVenda, index: ${i}`, JSON.stringify(novosItensVenda[i]), "Não podem existir dois itens com o mesmo produto na mesma venda."))
            } else {
                IDsDeProdutos.push(produto.id)
            }

            o.produto = produto

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

