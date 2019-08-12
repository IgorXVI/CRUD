const Model = require("./Model")
const DAO = require("../database/DAO")

module.exports = class Vendas extends Model {
    constructor() {
        super("venda", "vendas")

        this.JSON.funcionario = 0
        this.JSON.cliente = 0
        this.JSON.itensVenda = []
        this.IDsDeProdutos = []
    }

    async adicionaUm(objeto) {
        try {
            const itensVendaDAO = new DAO("itensVenda")
            const estoqueDAO = new DAO("estoque")

            await this._gerarAtributosJSON(objeto)

            let valorTotal = 0

            for (let i = 0; i < this.JSON.itensVenda; i++) {
                let o = this.JSON.itensVenda[i]
                let estoques = await estoqueDAO.buscaTodosPorColuna(o.produto.id, "produto")
                let estLista = []
                let estoquesQuantidade = 0
                if (estoques.length) {
                    estoques = estoques.sort((a, b) => b.quantidade - a.quantidade)
                    for (let j = 0; j < estoques.length; j++) {
                        let est = estoques[j]

                        if (est.quantidade > o.quantidade) {
                            estoquesQuantidade = o.quantidade
                            est.quantidadeTransporte = o.quantidade
                            est.quantidade -= o.quantidade
                        } else {
                            estoquesQuantidade += est.quantidade
                            est.quantidadeTransporte = est.quantidade
                            est.quantidade = 0
                        }

                        estLista.push(est)

                        if (estoquesQuantidade === o.quantidade) {
                            await this._atualizarEstoques(estLista, o.id)
                            break
                        }
                    }
                }
                if (estoquesQuantidade < o.quantidade) {
                    throw new Error(await this._formataErro(`itensVenda, index: ${i}, param: quantidade`, o.quantidade, `O produto informado não possui quantidade suficiente no estoque para realizar essa venda.`))
                }

                o.valorTotal = o.produto.precoUnidade * o.quantidade
                valorTotal += o.valorTotal
                this.JSON.itensVenda[i] = o
            }

            let venda = {
                valorTotal,
                funcionario: this.JSON.funcionario,
                cliente: this.JSON.cliente
            }

            const vendaId = (await this._DAO.adiciona(venda)).lastInsertRowid

            for (let i = 0; i < this.JSON.itensVenda.length; i++) {
                let o = this.JSON.itensVenda[i]
                let item = {
                    valorTotal: o.valorTotal,
                    quantidade: o.quantidade,
                    produto: o.produto.id,
                    venda: vendaId
                }
                await itensVendaDAO.adiciona(item)
            }
        } catch (e) {
            throw new Error(await this._lidarComErro(e))
        }
    }

    async atualizaUm(objeto) {
        try {
            this._gerarAtributosJSON(objeto)
            throw new Error("Esse objeto não pode utilizar o método atualizaUm().")
        } catch (e) {
            throw new Error(await this._lidarComErro(e))
        }
    }

    async buscaTodos(){
        try {
            let arr = await this._DAO.buscaTodos()
            for (let i = 0; i < arr.length; i++) {
                arr[i] = this._gerarBuscaVenda(arr[i].id)
            }
            return arr
        } catch (e) {
            throw new Error(await this._lidarComErro(e))
        }
    }

    async buscaUm(){
        try {
            return await this._gerarBuscaVenda(this.JSON.id)
        } catch (e) {
            throw new Error(await this._lidarComErro(e))
        }
    }

    async funcionario(novoFuncionario) {
        await this._validaNotNull("funcionario", novoFuncionario)
        await this._validaInteiro("funcionario", novoFuncionario, 1)
        await this._validaExiste(new DAO("funcionarios"), "funcionario", novoFuncionario)
        this.JSON.funcionario = novoFuncionario
    }

    async cliente(novoCliente) {
        await this._validaNotNull("cliente", novoCliente)
        await this._validaInteiro("cliente", novoCliente, 1)
        await this._validaExiste(new DAO("clientes"), "cliente", novoCliente)
        this.JSON.cliente = novoCliente
    }

    async itensVenda(novosItensVenda) {
        const produtosDAO = new DAO("produtos")

        let novosItensVenda2 = []
        await this._validaArray("itensVenda", novosItensVenda)
        for (let i = 0; i < novosItensVenda.length; i++) {
            let o = novosItensVenda[i]
            try {
                JSON.parse(JSON.stringify(o))
            } catch (e) {
                throw new Error(await this._formataErro(`itensVenda, index: ${i}`, o, "A lista deve conter apenas JSONs."))
            }
            if (!o.produto) {
                throw new Error(await this._formataErro(`itensVenda, index: ${i}`, o, "Todos os JSONs dentro do valor devem ter o atributo produto."))
            }
            if (!o.quantidade) {
                throw new Error(await this._formataErro(`itensVenda, index: ${i}`, o, "Todos os JSONs dentro do valor devem ter o atributo quantidade."))
            }

            await this._validaInteiro(`itensVenda, index: ${i}, param: produto`, o.produto, 1)
            await this._validaInteiro(`itensVenda, index: ${i}, param: quantidade`, o.quantidade, 1)

            const produto = await produtosDAO.buscaPorColuna(o.produto, "id")
            if (!produto) {
                throw new Error(await this._formataErro(`itensVenda, index: ${i}, param: produto`, o.produto, "O valor informado não está cadastrado."))
            }

            if (this.IDsDeProdutos.includes(produto.id)) {
                throw new Error(await this._formataErro(`itensVenda, index: ${i}, param: produto`, o.produto, "Não podem existir dois itens com o mesmo produto na mesma venda."))
            } else {
                this.IDsDeProdutos.push(produto.id)
            }

            o.produto = produto
            novosItensVenda2.push(o)
        }
        this.JSON.itensVenda = novosItensVenda2
    }

    async _gerarBuscaVenda(id) {
        const itensVendaDAO = new DAO("itensVenda")
        const produtosDAO = new DAO("produtos")
        const estoqueDAO = new DAO("estoque")
        const transportesDAO = new DAO("transportes")

        let venda = await this._buscaObjetoPorID(id, this._DAO)
        let itensVenda = await itensVendaDAO.buscaTodosPorColuna(id, "venda")
        if(itensVenda.length){
            for(let i = 0; i < itensVenda.length; i++){
                let item = itensVenda[i]
                item.produto = await this._buscaObjetoPorID(item.produto, produtosDAO)

                delete item.venda
                
                let transportes = await transportesDAO.buscaTodosPorColuna(id, "itemVenda")
                if(transportes.length){
                    for(let j = 0; j < transportes.length; j++){
                        let t = transportes[j]

                        delete t.itemVenda
                        
                        t.estoque = await this._buscaObjetoPorID(t.estoque, estoqueDAO)
                        delete t.estoque.produto
                        delete t.estoque.quantidade
                    }
                }
                item.transportes = transportes

                itensVenda[i] = item
            }
        }
        venda.itensVenda = itensVenda
        return venda
    }

    async _atualizarEstoques(lista, itemId) {
        const estoqueDAO = new DAO("estoque")
        const transportesDAO = new DAO("transportes")

        for (let i = 0; i < lista.length; i++) {
            let est = lista[i]

            const transporte = {
                estoque: est.id,
                itemVenda: itemId,
                quantidade: est.quantidadeTransporte
            }
            await transportesDAO.adiciona(transporte)

            delete est.quantidadeTransporte
            await estoqueDAO.atualizaPorColuna(est, "id")
        }
    }

}