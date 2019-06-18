const dbConnection = require("../database/db")
const express = require("express")
const bcrypt = require("bcrypt")
const validacao = require("./validacaoDeString")
const CidadesDAO = require("../DAO/CidadesDAO")
const FuncionariosDAO = require("../DAO/FuncionariosDAO")
const {
    body
} = require("express-validator/check")

const router = express.Router();

router.post("/funcionarios", [
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
    console.log("cadastrando funcionarios...")

    const errosValidacao = req.validationErrors()
    if (errosValidacao.lenght != 0) {
        res.status(400).json({
            errosValidacao
        })
        return
    }
    
    const funcionario = {
        cpf: req.body.cpf,
        nome: req.body.nome,
        email: req.body.email,
        senha: hashSenha,
        salario: req.body.salario,
        idCidade: cidadeID,
        nivelAcesso: req.body.nivelAcesso,
        dataCriacao: dataDeHoje(),
        dataAlteracao: dataDeHoje(),
        bairro: req.body.bairro,
        rua: req.body.rua,
        numeroCasa: req.body.numeroCasa,
        telefone: req.body.telefone,
        dataNasc: req.body.dataNasc,
        complemento: req.body.complemento
    }
})

function dataDeHoje() {
    return new Date().toISOString()
}

function fim() {
    console.log("fim")
}

module.exports = router