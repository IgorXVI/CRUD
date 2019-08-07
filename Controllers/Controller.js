const express = require("express")
const Validacao = require("./Validacao")

const _ = require('lodash');

module.exports = class Controller {
    constructor(nome, nomeSingular, atributos, gerarTodasRotas, masterDAO) {
        this.router = express.Router()

        this.validacao = new Validacao()

        this.masterDAO = masterDAO

        require("./APIURLs")[_.camelCase(nome)] = `api/${nome}/${nomeSingular}`

        this.atributos = atributos
        this.nome = nome
        this.nomeSingular = nomeSingular

        if (gerarTodasRotas) {
            this.gerarRotaBuscaTodos()
            this.gerarRotaBuscaUm()
            this.gerarRotaAdicionaUm(this.gerarValidacao(true))
            this.gerarRotaAtualizaUm(this.gerarValidacao(false))
            this.gerarRotaDeletaUm()
        }
    }

    gerarRotaBuscaTodos() {
        this.router.get("/", (req, res) => {
            (async () => {
                try {
                    this.inicio(req, res, `Buscando ${this.nome}...`)
                    await this.buscaTodos(req, res)
                } catch (erro) {
                    this.lidarComErro(erro, req, res)
                }
            })()
        })
    }

    gerarRotaAdicionaUm(validacao) {
        this.router.post(`/${this.nomeSingular}`, validacao, (req, res) => {
            (async () => {
                try {
                    this.inicio(req, res, `Adicionando ${this.nomeSingular}...`)
                    const objeto = this.gerarObjeto(req)
                    await this.adicionaUm(req, res, objeto)
                } catch (erro) {
                    this.lidarComErro(erro, req, res)
                }
            })()
        })
    }

    gerarRotaBuscaUm() {
        this.router.get(`/${this.nomeSingular}/:id`, (req, res) => {
            (async () => {
                try {
                    this.inicio(req, res, `Buscando ${this.nomeSingular} com id = ${req.params.id}...`)
                    await this.buscaUm(req, res)
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
                    await this.deletaUm(req, res)
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
                    const objeto = this.gerarObjeto(req)
                    await this.atualizaUm(req, res, objeto)
                } catch {
                    this.lidarComErro(erro, req, res)
                }
            })()
        })
    }

    async buscaTodos(req, res) {
        const DAO = this.masterDAO
        let arr = await DAO.buscaTodos()
        for (let i = 0; i < arr.length; i++) {
            arr[i] = await this.buscaObjetoPorID(arr[i].id, DAO)
        }
        res.status(200).json({
            resultado: arr
        })
        this.fim(req, res)
    }

    async deletaUm(req, res) {
        const DAO = this.masterDAO
        await this.buscaObjetoPorID(req.params.id, DAO)
        await DAO.deletaPorID(req.params.id)
        res.status(202).json({})
        this.fim(req, res)
    }

    async buscaUm(req, res) {
        const DAO = this.masterDAO
        let objeto = await this.buscaObjetoPorID(req.params.id, DAO)
        let arr = []
        arr.push(objeto)
        res.status(200).json({
            resultado: arr
        })
        this.fim(req, res)
    }

    async adicionaUm(req, res, objeto) {
        const DAO = this.masterDAO
        await DAO.adiciona(objeto)
        res.status(201).json({})
        this.fim(req, res)
    }

    async atualizaUm(req, res, objeto) {
        const DAO = this.masterDAO
        delete objeto.dataCriacao
        const objetoDB = await this.buscaObjetoPorID(req.params.id, DAO)
        const keys = Object.keys(objeto)
        let keysDB = Object.keys(objetoDB)
        keysDB.shift()
        for (let i = 0; i < keys.length; i++) {
            if (!objeto[keys[i]]) {
                objeto[keys[i]] = objetoDB[keysDB[i]]
            }
        }
        await DAO.atualizaPorID(objeto, req.params.id)
        res.status(201).json({})
        this.fim(req, res)
    }

    async buscaObjetoPorID(id, DAO) {
        let objeto = await DAO.buscaPorID(id)
        if (!objeto) {
            throw new Error("Erro no ID.");
        } else {
            objeto = await this.converterForeignKeyEmJSON(objeto)
            return objeto
        }
    }

    async converterForeignKeyEmJSON(objetoRecebido) {
        let objeto = objetoRecebido
        const keys = Object.keys(objeto)

        const DAOs = {
            cidadesDAO: new CidadesDAO(),
            funcionariosDAO: new FuncionariosDAO(),
            clientesDAO: new ClientesDAO(),
            fornecedoresDAO: new FornecedoresDAO(),
            produtosDAO: new ProdutosDAO(),
            estoqueDAO: new EstoqueDAO(),
            vendasDAO: new VendasDAO(),
            itensVendaDAO: new ItensVendaDAO(),
            usuariosDAO: new UsuariosDAO(),
        }

        for (let i = 0; i < keys.length; i++) {
            if (this.ehForeignKey(keys[i])) {
                let nome = keys[i].slice(2)
                nome = `${nome.charAt(0).toLowerCase()}${nome.slice(1)}`

                let url = require("./APIURLs")[_.camelCase(nome)]
                url = url.urlString
                url = `${url}/${objeto[keys[i]]}`

                let resultado = await this.buscaObjetoPorID(objeto[keys[i]], DAOs[`${_.camelCase(nome)}DAO`])

                let nomeSingular = url.replace(`/${nome}/`, ``)
                nomeSingular = nomeSingular.replace(`api`, ``)
                nomeSingular = nomeSingular.replace(`/${objeto[keys[i]]}`, ``)

                delete objeto[keys[i]]
                objeto[nomeSingular] = resultado
            }
        }
        return objeto
    }

    ehForeignKey(campo) {
        return campo.charAt(0) === 'i' && campo.charAt(1) === 'd' && campo.length > 2
    }

    lidarComErro(erroRecebido, req, res) {
        if (erroRecebido.message.includes("SQLITE_CONSTRAINT: FOREIGN KEY constraint failed")) {
            const erros = [{
                location: "params",
                param: "id",
                msg: "O valor informado está sendo usado como foreign key.",
                value: req.params.id
            }]
            res.status(400).json({
                erros
            })
        } else if (erroRecebido.message.includes("Erro no ID.")) {
            const erros = [{
                location: "params",
                param: "id",
                msg: "O valor informado não é válido.",
                value: req.params.id
            }]
            res.status(400).json({
                erros
            })
        } else if (erroRecebido.message.includes("Erro de validacao.")) {
            res.status(400).json({
                erros: req.validationErrors()
            })
        } else if (erroRecebido.message.includes("Erro dois itens de venda que possuem o mesmo produto e a mesma venda.")) {
            const erros = [{
                location: "body",
                param: "idProduto, idVenda",
                msg: "Não podem existir dois itens de venda que possuem o mesmo produto e a mesma venda.",
                value: [req.body.idVenda, req.body.idProduto]
            }]
            res.status(400).json({
                erros
            })
        } else if (erroRecebido.message.includes("Erro não existem produtos suficientes estocados para realizar essa venda.")) {
            const erros = [{
                location: "body",
                param: "idProduto",
                msg: "Não existem produtos suficientes estocados para realizar essa venda.",
                value: req.body.idProduto
            }]
            res.status(400).json({
                erros
            })
        } else if (erroRecebido.message.includes("Erro senha invalida.")) {
            const erros = [{
                location: "body",
                param: "senha",
                msg: "O valor não é válido.",
                value: req.body.senha
            }]
            res.status(400).json({
                erros
            })
            super.fim()
        } else if (erroRecebido.message.includes("Erro email ja cadastrado.")) {
            const erros = [{
                location: "body",
                param: "email",
                msg: "O valor informado já está cadastrado.",
                value: req.params.id
            }]
            res.status(400).json({
                erros
            })
        } else {
            console.log(erroRecebido)
            const erros = [{
                msg: "Erro no servidor."
            }]
            res.status(500).json({
                erros
            })
        }
        this.fim(req, res)
    }

    inicio(req, res, mensagem) {
        console.log(`request id: ${req.id}, data: ${this.dataDeHoje()} -> ${mensagem}`)
        const errosValidacao = req.validationErrors()
        if (errosValidacao) {
            throw new Error("Erro de validacao.")
        }
    }

    fim(req, res) {
        res.end()
        console.log(`request id: ${req.id}, data: ${this.dataDeHoje()} -> fim`)
    }

    gerarValidacao(obrigatorio, excecoes) {
        let excecoesArr = []
        if (excecoes) {
            excecoesArr = excecoes.map(excecao => `${excecao.charAt(0).toUpperCase()}${excecao.slice(1)}`)
        }

        const atributosArr = this.atributos.map(atributo => `${atributo.charAt(0).toUpperCase()}${atributo.slice(1)}`)

        let validacao = new Array()

        for (let i = 0; i < atributosArr.length; i++) {

            if (!(atributosArr[i] == "DataCriacao" || atributosArr[i] == "DataAlteracao")) {
                if ((excecoesArr.includes(atributosArr[i]))) {
                    validacao.push(this.validacao[`valida${atributosArr[i]}`](!obrigatorio))
                } else {
                    validacao.push(this.validacao[`valida${atributosArr[i]}`](obrigatorio))
                }
            }

        }
        return validacao
    }

    gerarObjeto(req) {
        let objeto = {}
        for (let i = 0; i < this.atributos.length; i++) {
            objeto[this.atributos[i]] = req.body[this.atributos[i]]
        }
        objeto.dataAlteracao = this.dataDeHoje()
        objeto.dataCriacao = this.dataDeHoje()
        return objeto
    }

    dataDeHoje() {
        return new Date().toISOString()
    }

}