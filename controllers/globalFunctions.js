const express = require("express")
const dbConnection = require("../config/db")
const CidadesDAO = require("../DAO/CidadesDAO")
const FuncionariosDAO = require("../DAO/FuncionariosDAO")

const {
    body
} = require("express-validator/check")

function validaCPF(obrigatorio) {
    let validacoes = new Array()
    if (obrigatorio) {
        validacoes.push(validaNotNull("CPF"))
    }
    validacoes.push(validaFixoChars("CPF", 14).optional())
    validacoes.push(body("CPF", "O atributo cpf deve estar no formato xxx.xxx.xxx-xx, onde x é um dígito.").matches(/^[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}$/).optional())
    return validacoes
}

function validaNome(obrigatorio) {
    let validacoes = new Array()
    if (obrigatorio) {
        validacoes.push(validaNotNull("nome"))
    }
    validacoes.push(validaMaxChars("nome", 100).optional())
    return validacoes
}

function validaEmail(obrigatorio) {
    let validacoes = new Array()
    if (obrigatorio) {
        validacoes.push(validaNotNull("email"))
    }
    validacoes.push(validaMaxChars("email", 255).optional())
    validacoes.push(body("email", "O atributo email informado está em um formato inválido.").isEmail().optional())
    return validacoes
}

function validaSenha(obrigatorio) {
    let validacoes = new Array()
    if (obrigatorio) {
        validacoes.push(validaNotNull("senha"))
    }
    validacoes.push(validaMinMaxChars("senha", 8, 255).optional())
    return validacoes
}

function validaSalario(obrigatorio) {
    let validacoes = new Array()
    if (obrigatorio) {
        validacoes.push(validaNotNull("salario"))
    }
    validacoes.push(validaDecimal("salario", 0).optional())
    return validacoes
}

function validaCidade(obrigatorio) {
    let validacoes = new Array()
    if (obrigatorio) {
        validacoes.push(validaNotNull("cidade"))
    }
    validacoes.push(validaMaxChars("cidade", 30).optional())
    validacoes.push(body("cidade").custom(nome => {
        const cidadesDAO = new CidadesDAO(dbConnection)
        return cidadesDAO.buscaIdPeloNome(nome).then(id => {
            if (!id) {
                return Promise.reject('A cidade informada não está cadastrada.');
            }
        });
    }).optional())
    return validacoes
}

function validaNivelAcesso(obrigatorio) {
    let validacoes = new Array()
    if (obrigatorio) {
        validacoes.push(validaNotNull("nivelAcesso"))
    }
    validacoes.push(validaInteiro("nivelAcesso", 0, 2).optional())
    return validacoes
}

function validaBairro(obrigatorio) {
    let validacoes = new Array()
    if (obrigatorio) {
        validacoes.push(validaNotNull("bairro"))
    }
    validacoes.push(validaMaxChars("bairro", 25).optional())
    return validacoes
}

function validaRua(obrigatorio) {
    let validacoes = new Array()
    if (obrigatorio) {
        validacoes.push(validaNotNull("rua"))
    }
    validacoes.push(validaMaxChars("rua", 25).optional())
    return validacoes
}

function validaNumeroCasa(obrigatorio) {
    let validacoes = new Array()
    if (obrigatorio) {
        validacoes.push(validaNotNull("numeroCasa"))
    }
    validacoes.push(validaInteiro("numeroCasa", 0, 1000000).optional())
    return validacoes
}

function validaComplemento(obrigatorio) {
    let validacoes = new Array()
    if (obrigatorio) {
        validacoes.push(validaNotNull("complemento"))
    }
    validacoes.push(validaMaxChars("complemento", 150).optional())
    return validacoes
}

function validaTelefone(obrigatorio) {
    let validacoes = new Array()
    if (obrigatorio) {
        validacoes.push(validaNotNull("telefone"))
    }
    validacoes.push(validaMaxChars("telefone", 15).optional())
    validacoes.push(body("telefone", "O atributo telefone deve estar no formato (xx) xxxxx-xxxx, onde x é um dígito.").matches(/^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}\-[0-9]{4}$/).optional())
    return validacoes
}

function validaDataNasc(obrigatorio) {
    let validacoes = new Array()
    if (obrigatorio) {
        validacoes.push(validaNotNull("dataNasc"))
    }
    validacoes.push(validaMaxChars("dataNasc", 10).optional())
    validacoes.push(validaDataISO8601("dataNasc").optional())
    return validacoes
}

function validaUF(obrigatorio) {
    let validacoes = new Array()
    if (obrigatorio) {
        validacoes.push(validaNotNull("UF"))
    }
    validacoes.push(validaFixoChars("UF", 2).optional())
    return validacoes
}

function validaCEP(obrigatorio) {
    let validacoes = new Array()
    if (obrigatorio) {
        validacoes.push(validaNotNull("CEP"))
    }
    validacoes.push(validaFixoChars("CEP", 9).optional())
    return validacoes
}

function validaNotNull(atributo) {
    return body(atributo, `É necessário informar o atributo ${atributo}.`).exists()
}

function validaFixoChars(atributo, valor) {
    return body(atributo, `O atributo ${atributo} deve conter ${valor} caractéres.`).isLength({
        min: valor,
        max: valor
    })
}

function validaMaxChars(atributo, maximo) {
    return body(atributo, `O atributo ${atributo} deve conter no máximo ${maximo} caractéres.`).isLength({
        max: maximo
    })
}

function validaMinMaxChars(atributo, minimo, maximo) {
    return body(atributo, `O atributo ${atributo} deve conter no mínimo ${minimo} e no máximo ${maximo} caractéres.`).isLength({
        min: minimo,
        max: maximo
    })
}

function validaDecimal(atributo, minimo, maximo) {
    if (minimo == null) {
        minimo = -1.79769e+308
    }

    if (maximo == null) {
        maximo = 1.79769e+308
    }

    return body(atributo, `O atributo ${atributo} deve ser um número de ponto flutuante, com um ponto separando a parte inteira da parte decimal, e conter um valor entre ${minimo} e ${maximo}`).isFloat({
        min: minimo,
        max: maximo
    })
}

function validaInteiro(atributo, minimo, maximo) {
    if (minimo == null) {
        minimo = -9223372036854775808
    }

    if (maximo == null) {
        maximo = 9223372036854775808
    }

    return body(atributo, `O atributo ${atributo} deve ser um número inteiro e conter um valor entre ${minimo} e ${maximo}`).isFloat({
        min: minimo,
        max: maximo
    })
}

function validaDataISO8601(atributo) {
    return body(atributo, `O atributo ${atributo} deve estar no formato aaaa-mm-dd, onde a é o ano, m é o mês e d é o dia.`).isISO8601()
}

function dataDeHoje() {
    return new Date().toISOString()
}

function fim() {
    console.log("fim")
}

module.exports = {
    express,
    dbConnection,
    FuncionariosDAO,
    CidadesDAO,
    validaCPF,
    validaBairro,
    validaCidade,
    validaComplemento,
    validaDataNasc,
    validaEmail,
    validaNivelAcesso,
    validaNome,
    validaNumeroCasa,
    validaRua,
    validaSalario,
    validaSenha,
    validaTelefone,
    validaUF,
    validaCEP,
    dataDeHoje,
    fim
}