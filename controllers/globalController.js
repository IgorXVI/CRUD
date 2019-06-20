const bcrypt = require("bcrypt")
const secret = require("../config/secret")
const jwt = require('jsonwebtoken')
const g = require("./globalFunctions")

const {
    body
} = require("express-validator/check")

const router = g.express.Router()

router.post("/login", [
    g.validaEmail(true),
    body("email").custom(email => {
        const DAO = new g.FuncionariosDAO(g.dbConnection)
        return DAO.buscaPorEmail(email).then(funcionario => {
            if (!funcionario) {
                return Promise.reject('O email informado não está cadastrado.');
            }
        });
    }).optional(),
    g.validaSenha(true)
], (req, res) => {
    console.log("realizando login de funcionario...")

    const errosValidacao = req.validationErrors()
    if (errosValidacao) {
        res.status(400).json({
            success: false,
            errosValidacao
        })
        g.fim()
        return
    }

    const email = req.body.email
    const senha = req.body.senha

    let funcionario = {}

    const funcionariosDAO = new g.FuncionariosDAO(g.dbConnection)
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
                        success: false,
                        erro: "Senha inválida."
                    })
                    g.fim()
                    return
                }
                const token = jwt.sign({
                        id: funcionario.id,
                        nivelAcesso: funcionario.nivelAcesso
                    },
                    secret, {
                        expiresIn: "1h"
                    }
                )
                res.status(202).json({
                    success: true,
                    token
                })
                g.fim()
                return
            }
        )
        .catch(
            (erro) => {
                console.log(erro)
                res.status(500).json({
                    success: false,
                    erro: "Erro no servidor."
                })
                g.fim()
                return
            }
        )

})

module.exports = router