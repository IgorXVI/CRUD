const Model = require("./Model")
const DAO = require("../database/DAO")

module.exports = class Vendas extends Model {
    constructor() {
        super("venda", "vendas")
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
                let est = listaEstoque[j]
    
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

    async atualizaUm(objeto) {
        this._gerarAtributosJSON(objeto)
        throw new Error("Esse objeto não pode utilizar o método atualizaUm().")
    }

    async buscaTodos() {
        let arr = await this._DAO.buscaTodos()
        for (let i = 0; i < arr.length; i++) {
            arr[i] = this._gerarBuscaVenda(arr[i].id)
        }
        return Promise.all(arr)
    }

    async buscaUm(id) {
        const ID = await this.id(id)
        return this._gerarBuscaVenda(ID)
    }

    async deletaUm(id) {
        const ID = await this.id(id)

        const itensVendaDAO = new DAO("itensVenda")
        const transportesDAO = new DAO("transportes")

        const itensVenda = await itensVendaDAO.buscaTodosPorColuna(ID, "venda")
        for (let i = 0; i < itensVenda.length; i++) {
            const item = itensVenda[i]

            const transportes = await transportesDAO.buscaTodosPorColuna(item.id, "itemVenda")
            for (let j = 0; j < transportes.length; j++) {
                const t = transportes[j]
                await transportesDAO.deletaPorColuna(t.id, "id")
            }

            await itensVendaDAO.deletaPorColuna(item.id, "id")
        }

        const info = await this._DAO.deletaPorColuna(ID, "id")
        if (info.changes === 0) {
            throw new Error("Erro: ID dos params nao existe.")
        }
    }

    async funcionario(novoFuncionario) {
        await this._validaNotNull("funcionario", novoFuncionario)
        await this._validaInteiro("funcionario", novoFuncionario, 1)
        await this._validaExiste(new DAO("funcionarios"), "funcionario", novoFuncionario)
        return novoFuncionario
    }

    async cliente(novoCliente) {
        await this._validaNotNull("cliente", novoCliente)
        await this._validaInteiro("cliente", novoCliente, 1)
        await this._validaExiste(new DAO("clientes"), "cliente", novoCliente)
        return novoCliente
    }

    async itensVenda(novosItensVenda) {
        const produtosDAO = new DAO("produtos")
        const estoqueDAO = new DAO("estoque")

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
            let estoquesQuantidade = 0
            if (estoques.length) {
                for (let j = 0; j < estoques.length; j++) {
                    let est = estoques[j]
                    
                    estoquesQuantidade += est.quantidade

                    if (estoquesQuantidade >= o.quantidade) {
                        break
                    }
                }
            }
            if (estoquesQuantidade < o.quantidade) {
                throw new Error(await this._formataErro(`itensVenda, index: ${i}`, JSON.stringify(novosItensVenda[i]), `O produto informado não possui quantidade suficiente no estoque para realizar essa venda.`))
            }

            novosItensVenda2.push(o)
        }
        return {
            itens: novosItensVenda2,
            listaEstoque: estLista,
            valorTotal
        }
    }

    async _gerarBuscaVenda(id) {
        const itensVendaDAO = new DAO("itensVenda")
        const produtosDAO = new DAO("produtos")
        const estoqueDAO = new DAO("estoque")
        const transportesDAO = new DAO("transportes")
        const cidadesDAO = new DAO("cidades")

        let venda = await this._buscaObjetoPorID(id, this._DAO)
        let itensVenda = await itensVendaDAO.buscaTodosPorColuna(id, "venda")
        if (itensVenda.length) {
            for (let i = 0; i < itensVenda.length; i++) {
                let item = itensVenda[i]
                item.produto = await this._buscaObjetoPorID(item.produto, produtosDAO)

                let transportes = await transportesDAO.buscaTodosPorColuna(item.id, "itemVenda")
                if (transportes.length) {
                    for (let j = 0; j < transportes.length; j++) {
                        let t = transportes[j]
                        delete t.itemVenda

                        const estoque = await estoqueDAO.buscaPorColuna(t.estoque, "id")
                        delete t.estoque
                        t.enderecoEstoque = {
                            cidade: await this._buscaObjetoPorID(estoque.cidade, cidadesDAO),
                            telefone: estoque.telefone,
                            bairro: estoque.bairro,
                            rua: estoque.rua,
                            numeroCasa: estoque.numeroCasa,
                            complemento: estoque.complemento
                        }
                    }
                }
                item.transportes = transportes

                itensVenda[i] = item
            }
        }
        venda.itensVenda = itensVenda
        return venda
    }

    async _distanciaEntreCoordenadas(lat1, lon1, lat2, lon2){
        const RaioTerra = 6371
        const omega1 = lat1 * (Math.PI/180)
        const omega2 = lat2 * (Math.PI/180)
        const omegaD = (lat2 - lat1) * (Math.PI/180)
        const lambdaD = (lon2 - lon1) * (Math.PI/180)

        const a = Math.pow( Math.sin(omegaD/2), 2 ) + Math.cos(omega1) + Math.cos(omega2) + Math.pow( Math.sin(lambdaD/2), 2 )

        const c = 2 * Math.atan2( Math.sqrt(a), Math.sqrt(1 - a) )

        const d = RaioTerra * c

        return d
    }

}