const Controller = require("./Controller")
const bcrypt = require("bcrypt")
const secret = require("../config/secret")
const jwt = require('jsonwebtoken')

const {
    body
} = require("express-validator/check")

module.exports = class UsuariosController extends Controller {
    constructor() {
        super(`usuarios`, `usuario`, `nome, email, senha, nivelAcesso, dataAlteracao, dataCriacao`, false)

        this.masterDAO = this.usuariosDAO

        this.gerarRotaLogin()
        this.gerarRotaSignup()
        this.gerarRotaAdicionaUm()
        this.gerarRotaAtualizaUm()
        super.gerarRotaBuscaTodos()
        super.gerarRotaBuscaUm()
        super.gerarRotaDeletaUm()
    }

    gerarRotaLogin() {
        let dadosBanco = undefined

        this.router.post(`/usuario/login`, [
            super.validaEmail(true),
            body("email").custom(email => {
                return this.usuariosDAO.buscaPorEmail(email).then(usuario => {
                    if (!usuario) {
                        return Promise.reject('O atributo email informado não está cadastrado.');
                    } else {
                        dadosBanco = usuario
                    }
                });
            }).optional(),
            super.validaSenha(true)
        ], (req, res) => {
            if (super.inicio(req, res, "Fazendo login de usuario...")) {
                return
            }

            bcrypt.compare(req.body.senha, dadosBanco.senha)
                .then(
                    (senhaEhValida) => {
                        if (!senhaEhValida) {
                            res.status(400).json({
                                success: false,
                                erro: "O atributo senha é inválido."
                            })
                            super.fim()
                        }
                        const token = jwt.sign({
                                id: dadosBanco.id,
                                nivelAcesso: dadosBanco.nivelAcesso
                            },
                            secret, {
                                expiresIn: "1h"
                            }
                        )
                        res.status(202).json({
                            success: true,
                            token
                        })
                        super.fim()
                    }
                )
                .catch(
                    erro => super.erroServidor(erro, res)
                )
        })
    }

    gerarRotaSignup() {
        this.router.post(`/usuario/signup`, [
            super.validaNome(true),
            super.validaEmail(true),
            body("email").custom(email => {
                return this.usuariosDAO.buscaPorEmail(email).then(usuario => {
                    if (usuario) {
                        return Promise.reject('O atributo email informado já está cadastrado.');
                    }
                });
            }).optional(),
            super.validaSenha(true)
        ], (req, res) => {
            if (super.inicio(req, res, "Fazendo signup de usuario...")) {
                return
            }

            const dadosSignup = super.gerarObjeto(req)
            dadosSignup.nivelAcesso = 2

            bcrypt.hash(dadosSignup.senha, 10)
                .then(
                    (hash) => {
                        dadosSignup.senha = hash
                        super.adicionaUm(req, res, dadosSignup)
                    }
                )
        })
    }

    gerarRotaAdicionaUm() {
        this.router.post(`/usuario`, [
            super.validaNome(true),
            super.validaEmail(true),
            body("email").custom(email => {
                return this.usuariosDAO.buscaPorEmail(email).then(usuario => {
                    if (usuario) {
                        return Promise.reject('O atributo email informado já está cadastrado.');
                    }
                });
            }).optional(),
            super.validaSenha(true),
            super.validaNivelAcesso(true)
        ], (req, res) => {
            if (super.inicio(req, res, "Adicionando usuario...")) {
                return
            }

            const objeto = super.gerarObjeto(req)

            bcrypt.hash(objeto.senha, 10)
                .then(
                    (hash) => {
                        objeto.senha = hash
                        super.adicionaUm(req, res, objeto)
                    }
                )
        })
    }

    gerarRotaAtualizaUm() {
        this.router.post(`/usuario/:id`, [
            super.validaNome(false),
            super.validaEmail(false),
            body("email").custom(email => {
                return this.usuariosDAO.buscaPorEmail(email).then(usuario => {
                    if (usuario) {
                        return Promise.reject('O atributo email informado já está cadastrado.');
                    }
                });
            }).optional(),
            super.validaSenha(false),
            super.validaNivelAcesso(false)
        ], (req, res) => {
            if (super.inicio(req, res, `Atualizando o usuário com id = ${req.params.id}...`)) {
                return
            }

            const objeto = super.gerarObjeto(req)

            if (objeto.senha) {
                bcrypt.hash(objeto.senha, 10)
                    .then(
                        (hash) => {
                            objeto.senha = hash
                            super.atualizaUm(req, res, objeto)
                        }
                    )
            } else {
                super.atualizaUm(req, res, objeto)
            }
        })
    }
}