const dbConnection = require("../config/db")
const express = require("express")
const bcrypt = require("bcrypt")
const validacao = require("./validacaoDeString")
const FuncionariosDAO = require("../DAO/FuncionariosDAO")
const secret = require("../config/secret")
const jwt = require('jsonwebtoken')
const g =  require("./globalFunctions")
const {
    body
} = require("express-validator/check")

const router = express.Router()

router.post("/login", [
    validacao.validaEmail(),
    body("email").custom(email => {
        const funcionariosDAO = new FuncionariosDAO(dbConnection)
        return funcionariosDAO.buscaPorEmail(email).then(funcionario => {
            if (!funcionario) {
                return Promise.reject('O email informado não está cadastrado.');
            }
        });
    }),
    validacao.validaSenha()
], (req, res) => {
    console.log("realizando login de funcionario...")

    const errosValidacao = req.validationErrors()
    if (errosValidacao) {
        res.status(400).json({
            errosValidacao
        })
        g.fim()
        return
    }

    const email = req.body.email
    const senha = req.body.senha

    let funcionario = {}

    const funcionariosDAO = new FuncionariosDAO(dbConnection)
    funcionariosDAO.buscaPorEmail(email)
        .then(
            (resultado) => {
                funcionario = resultado
                return bcrypt.compare(senha, funcionario.senha)
            }
        )
        .then(
            (senhaEhValida) => {
                if (!senhaEhValida) {
                    res.status(400).json({
                        erro: "Senha inválida."
                    })
                    g.fim()
                    return
                } else {
                    const token = jwt.sign({
                            email,
                            id: funcionario.id
                        },
                        secret, {
                            expiresIn: "1h"
                        }
                    )
                    res.status(201).json({
                        token
                    })
                    g.fim()
                }
            }
        )
        .catch(
            (erro) => {
                console.log(erro)
                res.status(500).json({
                    erro: "Erro no servidor."
                })
                g.fim()
            }
        )

})

module.exports = router