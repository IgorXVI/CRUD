const Controller = require("./Controller")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

const {
    body
} = require("express-validator/check")

module.exports = class UsuariosController extends Controller {
    constructor() {
        super(`usuarios`, `usuario`, ['nome',
            'email',
            'senha',
            'nivelAcesso',
            'dataAlteracao',
            'dataCriacao'
        ], false)

        this.gerarRotaLogin()
        this.gerarRotaSignup()
        this.gerarRotaAdicionaUm()
        this.gerarRotaAtualizaUm()
        this.gerarRotaLogout()
        super.gerarRotaBuscaTodos()
        super.gerarRotaBuscaUm()
        super.gerarRotaDeletaUm()
    }

    gerarRotaLogin() {
        let dadosBanco = undefined

        this.router.post(`/usuario/login`, [
            super.validaEmail(true),
            body("email").custom(valor => {
                return this.usuariosDAO.buscaPorEmail(valor).then(objeto => {
                    if (!objeto) {
                        return Promise.reject(`O valor informado não está cadastrado.`);
                    } else {
                        dadosBanco = objeto
                    }
                });
            }).optional(),
            super.validaSenha(true),
            body("tokenEmJSON").isBoolean().withMessage("O valor deve ser booleano."),
            body("tokenEmJSON").exists().withMessage("O valor deve ser informado.")
        ], (req, res) => {
            (async () => {
                try {
                    super.inicio(req, res, "Fazendo login de usuario...")
                    const senhaEhValida = await bcrypt.compare(req.body.senha, dadosBanco.senha)
                    if (!senhaEhValida) {
                        throw new Error("Erro senha invalida.")
                    }
                    const token = jwt.sign({
                            id: dadosBanco.id,
                            nivelAcesso: dadosBanco.nivelAcesso
                        },
                        process.env.SECRET, {
                            expiresIn: "1h"
                        }
                    )
                    const tokenEmJSON = (req.body.tokenEmJSON == "true")
                    if (tokenEmJSON) {
                        res.status(201).json({
                            token
                        })
                    } else {
                        res.status(201).cookie("auth", token, {
                            expires: new Date(Date.now() + 3500000),
                            httpOnly: true
                        })
                        res.end()
                    }
                    super.fim()
                } catch (erro) {
                    this.lidarComErro(erro, req, res)
                }
            })()
        })
    }

    gerarRotaSignup() {
        this.router.post(`/usuario/signup`, [
            super.validaNome(true),
            super.validaEmail(true),
            super.validaCampoUnico(this.usuariosDAO, "email"),
            super.validaSenha(true)
        ], (req, res) => {
            (async () => {
                try {
                    super.inicio(req, res, "Fazendo signup de usuario...")
                    const dadosSignup = super.gerarObjeto(req)
                    dadosSignup.nivelAcesso = 2
                    dadosSignup.senha = await bcrypt.hash(dadosSignup.senha, 10)
                    await super.adicionaUm(req, res, dadosSignup)
                } catch (erro) {
                    this.lidarComErro(erro, req, res)
                }
            })()
        })
    }

    gerarRotaAdicionaUm() {
        this.router.post(`/usuario`, [
            super.validaNome(true),
            super.validaEmail(true),
            super.validaCampoUnico(this.usuariosDAO, "email"),
            super.validaSenha(true),
            super.validaNivelAcesso(true)
        ], (req, res) => {
            (async () => {
                try {
                    super.inicio(req, res, "Adicionando usuario...")
                    const objeto = super.gerarObjeto(req)
                    objeto.senha = await bcrypt.hash(objeto.senha, 10)
                    await super.adicionaUm(req, res, objeto)
                } catch (erro) {
                    this.lidarComErro(erro, req, res)
                }
            })()
        })
    }

    gerarRotaAtualizaUm() {
        this.router.post(`/usuario/:id`, [
            super.validaNome(false),
            super.validaEmail(false),
            super.validaSenha(false),
            super.validaNivelAcesso(false)
        ], (req, res) => {
            (async () => {
                try {
                    super.inicio(req, res, `Atualizando o usuário com id = ${req.params.id}...`)
                    const objeto = super.gerarObjeto(req)
                    if(objeto.email){
                        const resultado = await this.usuariosDAO.buscaPorEmail(objeto.email)
                        if( !( !resultado || (resultado && resultado.id == req.params.id) ) ){
                            throw new Error("Erro email ja cadastrado.")
                        }
                    }
                    if(objeto.senha){
                        objeto.senha = await bcrypt.hash(objeto.senha, 10)
                    }
                    await super.atualizaUm(req, res, objeto)
                } catch (erro) {
                    this.lidarComErro(erro, req, res)
                }
            })()
        })
    }

    gerarRotaLogout() {
        this.router.delete(`/usuario/logout`, (req, res) => {
            if (this.inicio(req, res, `Fazendo logout de usuario...`)) {
                return
            }
            res.status(202).clearCookie("auth")
            res.end()
            super.fim()
        })
    }

}