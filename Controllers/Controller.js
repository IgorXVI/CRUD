const express = require("express")
const _ = require('lodash')
module.exports = class Controller {
    constructor(model, naoGerarTodasRotas) {
        this.router = express.Router()
        this.model = model

        this.nomePlural = _.kebabCase(model.nomePlural)
        this.nomeSingular = _.kebabCase(model.nomeSingular)

        if(!naoGerarTodasRotas){
            this.gerarRotaAdicionaUm()
            this.gerarRotaAtualizaUm()
            this.gerarRotaBuscaTodos()
            this.gerarRotaBuscaUm()
            this.gerarRotaDeletaUm()
        }
    }

    gerarRotaBuscaTodos() {
        this.router.get(`api/${this.nomePlural}`, async (req, res) => {
            try {
                await this.inicio(req, res, `Buscando ${this.nomePlural}...`)
                const resultado = await this.model.buscaTodos()
                res.status(200).json(resultado)
                this.fim(req, res)
            } catch (erro) {
                this.lidarComErro(erro, req, res)
            }
        })
    }

    gerarRotaAdicionaUm() {
        this.router.post(`api/${this.nomePlural}/${this.nomeSingular}`, async (req, res) => {
            try {
                await this.inicio(req, res, `Adicionando ${this.nomeSingular}...`)
                await this.model.adicionaUm(req.body)
                res.status(200)
                this.fim(req, res)
            } catch (erro) {
                this.lidarComErro(erro, req, res)
            }
        })
    }

    gerarRotaBuscaUm() {
        this.router.get(`api/${this.nomePlural}/${this.nomeSingular}/:id`, async (req, res) => {
            try {
                await this.inicio(req, res, `Buscando ${this.nomeSingular} com id = ${req.params.id}...`)
                const resultado = await this.model.buscaUm(req.params.id)
                res.status(200).json(resultado)
                this.fim(req, res)
            } catch (erro) {
                this.lidarComErro(erro, req, res)
            }
        })
    }

    gerarRotaDeletaUm() {
        this.router.delete(`api/${this.nomePlural}/${this.nomeSingular}/:id`, async (req, res) => {
            try {
                await this.inicio(req, res, `Deletando ${this.nomeSingular} com id = ${req.params.id}...`)
                await this.model.deletaUm(req.params.id)
                res.status(200)
                this.fim(req, res)
            } catch (erro) {
                this.lidarComErro(erro, req, res)
            }
        })
    }

    gerarRotaAtualizaUm() {
        this.router.post(`api/${this.nomePlural}/${this.nomeSingular}/:id`, async (req, res) => {
            try {
                await this.inicio(req, res, `Atualizando ${this.nomeSingular} com id = ${req.params.id}...`)
                await this.model.atualizaUm(req.body, req.params.id)
            } catch (erro) {
                this.lidarComErro(erro, req, res)
            }
        })
    }

    async inicio(req, res, mensagem) {
        console.log(`request: ${req.id}, data: ${await this.dataDeHoje()} -> ${mensagem}`)
    }

    async fim(req, res) {
        res.end()
        console.log(`request: ${req.id}, data: ${await this.dataDeHoje()} -> fim`)
    }

    async lidarComErro(erro, req, res){
        try {
            const err = JSON.parse(erro)
            if(err.msg === "Erro no servidor."){
                res.status(500).json(err)
            }
            else{
                res.status(400).json(err)
            }
        }
        catch (e) {
            console.log(e)
            res.status(500).json({msg: "Erro no servidor."})
        }
        this.fim(req, res)
    }

    async dataDeHoje() {
        return new Date().toISOString()
    }

}