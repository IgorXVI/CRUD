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
        this.router.get(`/${this.nomePlural}`, async (req, res) => {
            try {
                await this.inicio(req, res, `Buscando ${this.nomePlural}...`)
                await this.buscaTodos(req, res)
            } catch (erro) {
                this.lidarComErro(erro, req, res)
            }
        })
    }

    gerarRotaAdicionaUm() {
        this.router.post(`/${this.nomePlural}/${this.nomeSingular}`, async (req, res) => {
            try {
                await this.inicio(req, res, `Adicionando ${this.nomeSingular}...`)
                const objeto = await this.gerarObjeto(req)
                await this.adicionaUm(req, res, objeto)
            } catch (erro) {
                this.lidarComErro(erro, req, res)
            }
        })
    }

    gerarRotaBuscaUm() {
        this.router.get(`/${this.nomePlural}/${this.nomeSingular}/:id`, async (req, res) => {
            try {
                await this.inicio(req, res, `Buscando ${this.nomeSingular} com id = ${req.params.id}...`)
                await this.buscaUm(req, res)
            } catch (erro) {
                this.lidarComErro(erro, req, res)
            }
        })
    }

    gerarRotaDeletaUm() {
        this.router.delete(`/${this.nomePlural}/${this.nomeSingular}/:id`, async (req, res) => {
            try {
                await this.inicio(req, res, `Deletando ${this.nomeSingular} com id = ${req.params.id}...`)
                await this.deletaUm(req, res)
            } catch (erro) {
                this.lidarComErro(erro, req, res)
            }
        })
    }

    gerarRotaAtualizaUm() {
        this.router.post(`/${this.nomePlural}/${this.nomeSingular}/:id`, async (req, res) => {
            try {
                await this.inicio(req, res, `Atualizando ${this.nomeSingular} com id = ${req.params.id}...`)
                const objeto = await this.gerarObjeto(req)
                await this.atualizaUm(req, res, objeto)
            } catch (erro) {
                this.lidarComErro(erro, req, res)
            }
        })
    }

    async inicio(req, res, mensagem) {
        console.log(`request id: ${req.id}, data: ${await this.dataDeHoje()} -> ${mensagem}`)
    }

    async fim(req, res) {
        res.end()
        console.log(`request id: ${req.id}, data: ${await this.dataDeHoje()} -> fim`)
    }

    async lidarComErro(erro, req, res){
        try {
            const erros = JSON.parse(erro)
            if(!(erros instanceof Array)){
                let s = 400
                if(erros.msg === "Erro no servidor."){
                    s = 500
                }
                res.status(s).json({
                    erros: [erros]
                })
            }
            else{
                res.status(400).json({
                    erros
                })
            }
        }
        catch (e) {
            console.log(e)
            res.status(500).json({
                erros: [{msg: "Erro no servidor."}]
            })
        }
        this.fim(req, res)
    }

    async dataDeHoje() {
        return new Date().toISOString()
    }

}