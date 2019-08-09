const PessoaFisicaController = require("./PessoaFisicaController")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const {
    body
} = require("express-validator/check")

module.exports = class UsuariosController extends PessoaFisicaController {
    constructor(nome, nomeSingular, atributos, gerarTodasRotas, masterDAO) {
        super(nome, nomeSingular, ['senha', 'nivelAcesso'].concat(atributos), false, masterDAO)

        if (gerarTodasRotas) {
            this.gerarRotaLogin()
            this.gerarRotaSignup(this.gerarValidacao(true))
            this.gerarRotaAdicionaUm(this.gerarValidacao(true))
            this.gerarRotaAtualizaUm(this.gerarValidacao(false))
            this.gerarRotaLogout()
            super.gerarRotaBuscaTodos()
            super.gerarRotaBuscaUm()
            super.gerarRotaDeletaUm()
        }
    }

    gerarRotaLogin() {
        this.router.post(`/usuario/login`, [
            this.validaEmail(true),
            body("email").custom(valor => {
                return (async () => {
                    const objeto = await this.masterDAO.buscaPorEmail(valor)
                    if (!objeto) {
                        throw new Error(`O valor informado não está cadastrado.`);
                    }
                })()
            }).optional(),
            this.validaSenha(true),
            body("tokenEmJSON").isBoolean().withMessage("O valor deve ser booleano."),
            body("tokenEmJSON").exists().withMessage("O valor deve ser informado.")
        ], (req, res) => {
            (async () => {
                try {
                    await super.inicio(req, res, "Fazendo login de usuario...")
                    const dadosBanco = await this.masterDAO.buscaPorEmail(req.body.email)
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
                    super.fim(req, res)
                } catch (erro) {
                    this.lidarComErro(erro, req, res)
                }
            })()
        })
    }

    gerarRotaSignup(validacao) {
        this.router.post(`/usuario/signup`, validacao, (req, res) => {
            (async () => {
                try {
                    await super.inicio(req, res, "Fazendo signup de usuario...")
                    const dadosSignup = await super.gerarObjeto(req)
                    dadosSignup.nivelAcesso = 2
                    dadosSignup.senha = await bcrypt.hash(dadosSignup.senha, 10)
                    await super.adicionaUm(req, res, dadosSignup)
                } catch (erro) {
                    this.lidarComErro(erro, req, res)
                }
            })()
        })
    }

    gerarRotaAdicionaUm(validacao) {
        this.router.post(`/usuario`, validacao, (req, res) => {
            (async () => {
                try {
                    await super.inicio(req, res, "Adicionando usuario...")
                    const objeto = await super.gerarObjeto(req)
                    objeto.senha = await bcrypt.hash(objeto.senha, 10)
                    await super.adicionaUm(req, res, objeto)
                } catch (erro) {
                    this.lidarComErro(erro, req, res)
                }
            })()
        })
    }

    gerarRotaAtualizaUm(validacao) {
        this.router.post(`/usuario/:id`, validacao, (req, res) => {
            (async () => {
                try {
                    await super.inicio(req, res, `Atualizando o usuário com id = ${req.params.id}...`)
                    const objeto = await super.gerarObjeto(req)
                    if (objeto.email) {
                        const resultado = await this.masterDAO.buscaPorEmail(objeto.email)
                        if (!(!resultado || (resultado && resultado.id == req.params.id))) {
                            throw new Error("Erro email ja cadastrado.")
                        }
                    }
                    if (objeto.senha) {
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
            res.json({})
            super.fim(req, res)
        })
    }

    validaSenha(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("senha"))
        }
        validacoes.push(this.validaMinMaxChars("senha", 8, 255))
        return validacoes
    }

    validaNivelAcesso(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("nivelAcesso"))
        }
        validacoes.push(this.validaInteiro("nivelAcesso", 0, 2))
        return validacoes
    }

}