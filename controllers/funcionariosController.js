const dbConnection = require("../config/db")
const express = require("express")
const bcrypt = require("bcrypt")
const validacao = require("./validacaoDeString")
const CidadesDAO = require("../DAO/CidadesDAO")
const FuncionariosDAO = require("../DAO/FuncionariosDAO")
const g = require("./globalFunctions")
const {
    body
} = require("express-validator/check")

const router = express.Router()

router.get("/", (req, res) => {
    console.log("buscando todas os funcionarios...")
    const funcionariosDAO = new FuncionariosDAO(dbConnection)
    funcionariosDAO.buscaTodos()
        .then(
            (funcionarios) => {
                res.status(201).json(funcionarios)
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

router.post("/funcionario", [
    validacao.validaCPF(),
    validacao.validaNome(),
    validacao.validaEmail(),
    body("email").custom(email => {
        const funcionariosDAO = new FuncionariosDAO(dbConnection)
        return funcionariosDAO.buscaPorEmail(email).then(funcionario => {
            if (funcionario) {
                return Promise.reject('O email informado já está cadastrado.');
            }
        });
    }),
    validacao.validaSenha(),
    validacao.validaSalario(),
    validacao.validaCidade(),
    body("cidade").custom(nome => {
        const cidadesDAO = new CidadesDAO(dbConnection)
        return cidadesDAO.buscaIdPeloNome(nome).then(id => {
            if (!id) {
                return Promise.reject('A cidade informada não está cadastrada.');
            }
        });
    }),
    validacao.validaNivelAcesso(),
    validacao.validaBairro(),
    validacao.validaRua(),
    validacao.validaNumeroCasa(),
    validacao.validaComplemento(),
    validacao.validaTelefone(),
    validacao.validaDataNasc()
], (req, res) => {
    console.log("cadastrando funcionario")

    const errosValidacao = req.validationErrors()
    if (errosValidacao) {
        res.status(400).json({
            errosValidacao
        })
        g.fim()
        return
    }

    let funcionario = {
        cpf: req.body.cpf,
        nome: req.body.nome,
        email: req.body.email,
        senha: "",
        salario: req.body.salario,
        idCidade: 0,
        nivelAcesso: req.body.nivelAcesso,
        dataAlteracao: g.dataDeHoje(),
        dataCriacao: g.dataDeHoje(),
        bairro: req.body.bairro,
        rua: req.body.rua,
        numeroCasa: req.body.numeroCasa,
        telefone: req.body.telefone,
        dataNasc: req.body.dataNasc,
        complemento: req.body.complemento
    }

    const cidadesDAO = new CidadesDAO(dbConnection)
    const funcionariosDAO = new FuncionariosDAO(dbConnection)

    bcrypt.hash(req.body.senha, 10)
        .then(
            (hash) => {
                funcionario.senha = hash
                return cidadesDAO.buscaIdPeloNome(req.body.cidade)
            }
        )
        .then(
            (id) => {
                funcionario.idCidade = id
                return funcionariosDAO.adiciona(funcionario)
            }
        )
        .then(
            () => {
                res.status(201).json({
                    funcionario
                })
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