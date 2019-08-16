const express = require("express")
const log = require('log-to-file')
const _ = require('lodash')
module.exports = class Controller {
    constructor(Model, naoGerarTodasRotas) {
        this.router = express.Router()
        this.Model = Model

        this.proxy = "/api"

        this.nomePlural = _.kebabCase((new Model()).nomePlural)
        this.nomeSingular = _.kebabCase((new Model()).nomeSingular)

        if (!naoGerarTodasRotas) {
            this.gerarRotaAdicionaUm()
            this.gerarRotaAtualizaUm()
            this.gerarRotaBusca()
            this.gerarRotaBuscaUm()
            this.gerarRotaDeletaUm()
        }
    }

    gerarRotaBusca() {
        this.router.get(`${this.proxy}/${this.nomePlural}`, async (req, res) => {
            const model = new this.Model()
            try {
                await this.inicio(req, res, `Buscando ${this.nomePlural}...`)
                const resultado = await model.busca(req.query)
                res.status(200).json(resultado)
                await this.fim(req, res)
            } catch (erro) {
                await this.lidarComErro(erro, req, res)
            }
        })
    }

    gerarRotaBuscaUm() {
        this.router.get(`${this.proxy}/${this.nomePlural}/${this.nomeSingular}/:id`, async (req, res) => {
            const model = new this.Model()
            try {
                await this.inicio(req, res, `Buscando ${this.nomeSingular} com id = ${req.params.id}...`)
                const resultado = await model.buscaUm(req.params.id)
                res.status(200).json(resultado)
                await this.fim(req, res)
            } catch (erro) {
                await this.lidarComErro(erro, req, res)
            }
        })
    }

    gerarRotaAdiciona() {
        this.router.post(`${this.proxy}/${this.nomePlural}`, async (req, res) => {
            const model = new this.Model()
            try {
                await this.inicio(req, res, `Adicionando ${this.nomePlural}...`)
                await model.adiciona(req.body)
                res.status(200)
                await this.fim(req, res)
            } catch (erro) {
                await this.lidarComErro(erro, req, res)
            }
        })
    }

    gerarRotaAdicionaUm() {
        this.router.post(`${this.proxy}/${this.nomePlural}/${this.nomeSingular}`, async (req, res) => {
            const model = new this.Model()
            try {
                await this.inicio(req, res, `Adicionando ${this.nomeSingular}...`)
                await model.adicionaUm(req.body)
                res.status(200)
                await this.fim(req, res)
            } catch (erro) {
                await this.lidarComErro(erro, req, res)
            }
        })
    }

    gerarRotaDeleta() {
        this.router.delete(`${this.proxy}/${this.nomePlural}`, async (req, res) => {
            const model = new this.Model()
            try {
                await this.inicio(req, res, `Deletando ${this.nomePlural}...`)
                await model.deleta(req.query)
                res.status(200)
                await this.fim(req, res)
            } catch (erro) {
                await this.lidarComErro(erro, req, res)
            }
        })
    }

    gerarRotaDeletaUm() {
        this.router.delete(`${this.proxy}/${this.nomePlural}/${this.nomeSingular}/:id`, async (req, res) => {
            const model = new this.Model()
            try {
                await this.inicio(req, res, `Deletando ${this.nomeSingular} com id = ${req.params.id}...`)
                await model.deletaUm(req.params.id)
                res.status(200)
                await this.fim(req, res)
            } catch (erro) {
                await this.lidarComErro(erro, req, res)
            }
        })
    }

    gerarRotaAtualiza() {
        this.router.post(`${this.proxy}/${this.nomePlural}`, async (req, res) => {
            const model = new this.Model()
            try {
                await this.inicio(req, res, `Atualizando ${this.nomePlural}...`)
                await model.atualiza(req.body, req.query)
                res.status(200)
                await this.fim(req, res)
            } catch (erro) {
                await this.lidarComErro(erro, req, res)
            }
        })
    }

    gerarRotaAtualizaUm() {
        this.router.post(`${this.proxy}/${this.nomePlural}/${this.nomeSingular}/:id`, async (req, res) => {
            const model = new this.Model()
            try {
                await this.inicio(req, res, `Atualizando ${this.nomeSingular} com id = ${req.params.id}...`)
                await model.atualizaUm(req.body, req.params.id)
                res.status(200)
                await this.fim(req, res)
            } catch (erro) {
                await this.lidarComErro(erro, req, res)
            }
        })
    }

    async inicio(req, res, mensagem) {
        log(`request: ${req.id}, body: ${JSON.stringify(req.body)}, params: ${JSON.stringify(req.params)} -> ${mensagem}`)
        console.log(`request: ${req.id} -> ${mensagem}`)
    }

    async fim(req, res) {
        res.end()
        log(`request: ${req.id}, body: ${JSON.stringify(req.body)}, params: ${JSON.stringify(req.params)} -> fim`)
        console.log(`request: ${req.id} -> fim`)
    }

    async lidarComErro(erro, req, res) {
        try {
            let err = JSON.parse(erro.message)
            res.status(400).json(err)
        } catch (e) {
            console.log(erro)
            log(erro)
            res.status(500).json({
                msg: "Erro no servidor."
            })
        }
        this.fim(req, res)
    }

    async dataDeHoje() {
        return new Date().toISOString()
    }

}