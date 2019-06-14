const bcrypt = require("bcrypt")

const dbConnection = require("../Banco de Dados")

const CidadesDAO = require("../DAO/CidadesDAO")
const FuncionariosDAO = require("../DAO/FuncionariosDAO")

const Cidades = 

const { check } = require('express-validator/check');
const customValidation = [

]

module.exports = (app) => {
    app.post("api/cadastro/funcionario", (req, res) => {
        console.log("Cadastrando Funcionario...")

        validaCPF(req)
        validaNome(req)
        validaEmail(req)
        validaSenha(req)
        validaSalario(req)
        validaCidade(req)
        validaNivelAcesso(req)
        validaEndereco(req)
        validaTelefone(req)
        validaDataNasc(req)

        const errosValidacao = req.validationErrors()
        if (errosValidacao) {
            res.status(400).json({
                sucesso: false,
                errosValidacao
            })
            return
        }

        let hashSenha = ""

        const cidade = (buscarCidade(req.body.cidade)).id
        if (cidade == null) {
            res.status(500).json({
                sucesso: false,
                erro: "Erro ao buscar a cidade."
            })
            return
        }
        else if(cidade.length == 0){
            res.status(400).json({
                sucesso: false,
                erro: "Cidade não está cadastrada."
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
            endereco: req.body.endereco,
            telefone: req.body.telefone,
            dataNasc: req.body.dataNasc,
        }

        const funcionariosDAO = new FuncionariosDAO(dbConnection)
        funcionariosDAO.add(funcionario)
            .then(
                (funcionarioCadastrado) => {
                    res.send(201).json({
                        sucesso: true,
                        funcionarioCadastrado
                    })
                    return
                }
            )
            .catch(
                (erro) => {
                    console.error(erro)
                    res.send(500).json({
                        sucesso: false,
                        erro: "Erro ao cadastrar o funcionario."
                    })
                    return
                }
            )
    })
}

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

function validaNotNull(req, atributo) {
    req.assert(atributo, `É necessário informar o atributo ${atributo}.`).notEmpty()
}

function validaFixoChars(req, atributo, valor) {
    req.assert(atributo, `O atributo ${atributo} deve conter ${valor} caractéres.`).isLength({
        min: valor,
        max: valor
    })
}

function validaMaxChars(req, atributo, maximo) {
    req.assert(atributo, `O atributo ${atributo} deve conter no máximo ${maximo} caractéres.`).isLength({
        max: maximo
    })
}

function validaMinMaxChars(req, atributo, minimo) {
    req.assert(atributo, `O atributo ${atributo} deve conter no mínimo ${minimo} e no máximo ${maximo} caractéres.`).isLength({
        min: minimo,
        max: maximo
    })
}

function validaDecimal(req, atributo, minimo, maximo) {
    if (!minimo) {
        minimo = -1.79769e+308
    }

    if (!maximo) {
        maximo = 1.79769e+308
    }

    req.assert(atributo, `O atributo ${atributo} deve ser um número de ponto flutuante, com um "." separando a parte inteira da parte decimal, e conter um valor entre ${minimo} e ${maximo}`).isFloat({
        min: minimo,
        max: maximo
    })
}

function validaInteiro(req, atributo, minimo, maximo) {
    if (!minimo) {
        minimo = -9223372036854775808
    }

    if (!maximo) {
        maximo = 9223372036854775808
    }

    req.assert(atributo, `O atributo ${atributo} deve ser um número inteiro e conter um valor entre ${minimo} e ${maximo}`).isFloat({
        min: minimo,
        max: maximo
    })
}

function validaCPF(req) {
    validaNotNull(req, "cpf")
    validaFixoChars(req, "cpf", 14)
}

function validaNome(req) {
    validaNotNull(req, "nome")
    validaMaxChars(req, "nome", 100)
}

function validaEmail(req) {
    validaNotNull(req, "email")
    validaMaxChars(req, "email", 255)
    req.assert("email", "O atributo email informado está em um formato inválido.").isEmail()
}

function validaSenha(req) {
    validaNotNull(req, "senha")
    validaMinMaxChars(req, "senha", 8, 255)
}

function validaSalario(req) {
    validaNotNull(req, "salario")
    validaDecimal(req, "salario", 0)
}

function validaCidade(req) {
    validaNotNull(req, "cidade")
    validaMaxChars(req, "cidade", 30)
}

function validaNivelAcesso(req) {
    validaNotNull(req, "nivelAcesso")
    validaInteiro(req, "nivelAcesso", 0, 2)
}

function validaEndereco(req) {
    if (req.body.endereco) {
        validaMaxChars(req, "endereco", 255)
    }
}

function validaTelefone(req) {
    if (req.body.telefone) {
        validaMaxChars(req, "telefone", 15)
    }
}

function validaDataNasc(req) {
    if (req.body.dataNasc) {
        req.assert("dataNasc", "O atributo dataNasc deve estar no formato aaaa-mm-dd.").isISO8601()
        validaMaxChars(req, "dataNasc", 10)
    }
}