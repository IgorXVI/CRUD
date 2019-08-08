const express = require("express")
const DAOs = require("../DAOs/DAOs")
const { body } = require("express-validator/check")
const _ = require('lodash')
module.exports = class Controller {
    constructor(nome, nomeSingular, atributos, gerarTodasRotas, masterDAO) {
        this.router = express.Router()

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

        this.gerarValidacao = this.gerarValidacao.bind(this)
    }

    gerarRotaBuscaTodos() {
        this.router.get("/", (req, res) => {
            (async () => {
                try {
                    await this.inicio(req, res, `Buscando ${this.nome}...`)
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
                    await this.inicio(req, res, `Adicionando ${this.nomeSingular}...`)
                    const objeto = await this.gerarObjeto(req)
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
                    await this.inicio(req, res, `Buscando ${this.nomeSingular} com id = ${req.params.id}...`)
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
                    await this.inicio(req, res, `Deletando ${this.nomeSingular} com id = ${req.params.id}...`)
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
                    await this.inicio(req, res, `Atualizando ${this.nomeSingular} com id = ${req.params.id}...`)
                    const objeto = await this.gerarObjeto(req)
                    await this.atualizaUm(req, res, objeto)
                } catch (erro) {
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

    async atualizaUm(req, res, objetoRecebido) {
        const DAO = this.masterDAO
        let objeto = JSON.parse(JSON.stringify(objetoRecebido))
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

        const daos = {
            cidadesDAO: new DAOs.CidadesDAO(),
            funcionariosDAO: new DAOs.FuncionariosDAO(),
            clientesDAO: new DAOs.ClientesDAO(),
            fornecedoresDAO: new DAOs.FornecedoresDAO(),
            produtosDAO: new DAOs.ProdutosDAO(),
            estoqueDAO: new DAOs.EstoqueDAO(),
            vendasDAO: new DAOs.VendasDAO(),
            itensVendaDAO: new DAOs.ItensVendaDAO(),
            usuariosDAO: new DAOs.UsuariosDAO(),
        }

        for (let i = 0; i < keys.length; i++) {
            if (this.ehForeignKey(keys[i])) {
                let nome = keys[i].slice(2)
                nome = `${nome.charAt(0).toLowerCase()}${nome.slice(1)}`

                let url = require("./APIURLs")[_.camelCase(nome)]
                url = url.urlString
                url = `${url}/${objeto[keys[i]]}`

                let resultado = await this.buscaObjetoPorID(objeto[keys[i]], daos[`${_.camelCase(nome)}DAO`])

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

    async lidarComErro(erroRecebido, req, res) {
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

    async inicio(req, res, mensagem) {
        console.log(`request id: ${req.id}, data: ${this.dataDeHoje()} -> ${mensagem}`)
        const errosValidacao = req.validationErrors()
        if (errosValidacao) {
            throw new Error("Erro de validacao.")
        }
    }

    async fim(req, res) {
        res.end()
        console.log(`request id: ${req.id}, data: ${this.dataDeHoje()} -> fim`)
    }

    gerarValidacao(obrigatorio, excecoes) {
        let excecoesArr = []
        if (excecoes) {
            excecoesArr = excecoes.map(excecao => `${excecao.charAt(0).toUpperCase()}${excecao.slice(1)}`)
        }

        const atributosArr = this.atributos.map(atributo => `${atributo.charAt(0).toUpperCase()}${atributo.slice(1)}`)

        let validacaoArr = new Array()

        for (let i = 0; i < atributosArr.length; i++) {

            if ((excecoesArr.includes(atributosArr[i]))) {
                validacaoArr.push(this[`valida${atributosArr[i]}`](!obrigatorio))
            } else {
                validacaoArr.push(this[`valida${atributosArr[i]}`](obrigatorio))
            }

        }
        return validacaoArr
    }

    async gerarObjeto(req) {
        let objeto = {}
        for (let i = 0; i < this.atributos.length; i++) {
            objeto[this.atributos[i]] = req.body[this.atributos[i]]
        }
        return objeto
    }

    dataDeHoje() {
        return new Date().toISOString()
    }

    validaCampoUnico(DAO, campo) {
        return body(campo).custom(valor => {
            (async () => {
                const objeto = await DAO.buscaPorColuna(valor, campo)
                if (objeto) {
                    throw new Error(`O valor informado já está cadastrado.`);
                }
            })()
        }).optional()
    }

    validaNotNull(atributo) {
        return body(atributo, `É necessário informar o valor.`).exists()
    }

    validaFixoChars(atributo, valor) {
        return body(atributo, `O valor deve conter ${valor} caractéres.`).isLength({
            min: valor,
            max: valor
        }).optional()
    }

    validaMaxChars(atributo, maximo) {
        return body(atributo, `O valor deve conter no máximo ${maximo} caractéres.`).isLength({
            max: maximo
        }).optional()
    }

    validaMinMaxChars(atributo, minimo, maximo) {
        return body(atributo, `O valor deve conter no mínimo ${minimo} e no máximo ${maximo} caractéres.`).isLength({
            min: minimo,
            max: maximo
        }).optional()
    }

    validaDecimal(atributo, minimo, maximo) {
        if (minimo == null) {
            minimo = -1.79769e+308
        }

        if (maximo == null) {
            maximo = 1.79769e+308
        }

        return body(atributo, `O valor deve ser um número de ponto flutuante, com um ponto separando a parte inteira da parte decimal, e estar entre ${minimo} e ${maximo}`).isFloat({
            min: minimo,
            max: maximo
        }).optional()
    }

    validaInteiro(atributo, minimo, maximo) {
        if (minimo == null) {
            minimo = -9223372036854775808
        }

        if (maximo == null) {
            maximo = 9223372036854775808
        }

        return body(atributo, `O valor deve ser um número inteiro e estar entre ${minimo} e ${maximo}`).isFloat({
            min: minimo,
            max: maximo
        }).optional()
    }

    validaDataISO8601(atributo) {
        return body(atributo, `O valor deve estar no formato aaaa-mm-dd, onde a é o ano, m é o mês e d é o dia.`).isISO8601().optional()
    }

}