const dbConnection = require("../config/db")
const express = require("express")
const validacao = require("./validacaoDeString")
const CidadesDAO = require("../DAO/CidadesDAO")
const g = require("./globalFunctions")

const router = express.Router()

router.get("/", (req, res)=>{
    console.log("buscando todas as cidades...")
    const cidadesDAO = new CidadesDAO(dbConnection)
    cidadesDAO.buscaTodos()
        .then(
            (cidades) => {
                res.status(201).json(cidades)
                g.fim()
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

router.post("/cidade", [
    validacao.validaNome(),
    validacao.validaUF(),
    validacao.validaCEP()
], (req, res) => {
    console.log("cadastrando cidade...")

    const errosValidacao = req.validationErrors()
    if (errosValidacao) {
        res.status(400).json({
            errosValidacao
        })
        g.fim()
        return
    }

    const cidade = {
        nome: req.body.nome,
        UF: req.body.UF,
        CEP: req.body.CEP,
        dataAlteracao: g.dataDeHoje(),
        dataCriacao: g.dataDeHoje()
    }

    const cidadesDAO = new CidadesDAO(dbConnection)
    cidadesDAO.adiciona(cidade)
        .then(
            () => {
                res.status(201).send(cidade)
                g.fim()
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