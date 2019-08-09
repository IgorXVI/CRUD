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
        this.gerarObjeto = this.gerarObjeto.bind(this)
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

}