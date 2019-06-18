const express = require('express');
const bcrypt = require("bcrypt")

const CidadesDAO = require("../DAO/CidadesDAO")
const funcionarioController = require("../controllers/funcionariosController")

const router = express.Router();

router.post("/cadastro/funcionarios", funcionarioController.validaCadastro(), (req, res) => {
    console.log("Cadastrando Funcionario...")

    const errosValidacao = req.validationErrors()
    if(errosValidacao){
        res.status(400).json({
            errosValidacao
        })
        fim()
        return
    }

    res.status(200).end()
    fim()

    // let hashSenha = ""

    // const cidade = (buscarCidade(req.body.cidade)).id
    // if (cidade == null) {
    //     res.status(500).json({
    //         sucesso: false,
    //         erro: "Erro ao buscar a cidade."
    //     })
    //     return
    // } else if (cidade.length == 0) {
    //     res.status(400).json({
    //         sucesso: false,
    //         erro: "Cidade não está cadastrada."
    //     })
    //     return
    // }

    // const funcionario = req.body

    // const funcionariosDAO = new FuncionariosDAO(dbConnection)
    // funcionariosDAO.add(funcionario)
    //     .then(
    //         (funcionarioCadastrado) => {
    //             res.send(201).json({
    //                 sucesso: true,
    //                 funcionarioCadastrado
    //             })
    //             return
    //         }
    //     )
    //     .catch(
    //         (erro) => {
    //             console.error(erro)
    //             res.send(500).json({
    //                 sucesso: false,
    //                 erro: "Erro ao cadastrar o funcionario."
    //             })
    //             return
    //         }
    //     )
})

function dataDeHoje() {
    return new Date().toISOString()
}

function buscarCidade(nome) {
    const cidadesDAO = new CidadesDAO(dbConnection)
    cidadesDAO.busca(nome)
        .then(
            (cidade) => {
                return cidade
            }
        )
        .catch(
            (erro) => {
                console.error(erro)
                return null
            }
        )
}

function fim(){
    console.log("fim")
}

module.exports = router

