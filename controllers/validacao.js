const {
    body
} = require("express-validator/check")

function validaCPF() {
    let validacoes = new Array()
    validacoes.push(validaNotNull("cpf"))
    validacoes.push(validaFixoChars("cpf", 14))
    validacoes.push(body("cpf", "O atributo cpf deve estar no formato xxx.xxx.xxx-xx, onde x é um dígito.").matches(/^[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}$/))
    return validacoes
}

function validaNome() {
    let validacoes = new Array()
    validacoes.push(validaNotNull("nome"))
    validacoes.push(validaMaxChars("nome", 100))
    return validacoes
}

function validaEmail() {
    let validacoes = new Array()
    validacoes.push(validaNotNull("email"))
    validacoes.push(validaMaxChars("email", 255))
    validacoes.push(body("email", "O atributo email informado está em um formato inválido.").isEmail())
    return validacoes
}

function validaSenha() {
    let validacoes = new Array()
    validacoes.push(validaNotNull("senha"))
    validacoes.push(validaMinMaxChars("senha", 8, 255))
    return validacoes
}

function validaSalario() {
    let validacoes = new Array()
    validacoes.push(validaNotNull("salario"))
    validacoes.push(validaDecimal("salario", 0))
    return validacoes
}

function validaCidade() {
    let validacoes = new Array()
    validacoes.push(validaNotNull("cidade"))
    validacoes.push(validaMaxChars("cidade", 30))
    return validacoes
}

function validaNivelAcesso() {
    let validacoes = new Array()
    validacoes.push(validaNotNull("nivelAcesso"))
    validacoes.push(validaInteiro("nivelAcesso", 0, 2))
    return validacoes
}

function validaBairro() {
    let validacoes = new Array()
    validacoes.push(validaNotNull("bairro"))
    validacoes.push(validaMaxChars("bairro", 25))
    return validacoes
}

function validaRua() {
    let validacoes = new Array()
    validacoes.push(validaNotNull("rua"))
    validacoes.push(validaMaxChars("rua", 25))
    return validacoes
}

function validaNumeroCasa() {
    let validacoes = new Array()
    validacoes.push(validaNotNull("numeroCasa"))
    validacoes.push(validaInteiro("numeroCasa", 0, 1000000))
    return validacoes
}

function validaComplemento() {
    let validacoes = new Array()
    validacoes.push(validaMaxChars("complemento", 150).optional())
    return validacoes
}

function validaTelefone() {
    let validacoes = new Array()
    validacoes.push(validaNotNull("telefone"))
    validacoes.push(validaMaxChars("telefone", 15))
    validacoes.push(body("telefone", "O atributo telefone deve estar no formato (xx) xxxxx-xxxx, onde x é um dígito.").matches(/^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}\-[0-9]{4}$/))
    return validacoes
}

function validaDataNasc() {
    let validacoes = new Array()
    validacoes.push(validaNotNull("dataNasc"))
    validacoes.push(validaMaxChars("dataNasc", 10))
    validacoes.push(validaDataISO8601("dataNasc"))
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

module.exports = {
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
    validaTelefone
}