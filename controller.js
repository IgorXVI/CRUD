//https://www.freecodecamp.org/news/how-to-make-input-validation-simple-and-clean-in-your-express-js-app-ea9b5ff5a8a7/

const { body } = require("express-validator/check")

exports.valida = (metodo) => {
    switch (metodo) {
        case "cadastroFuncionarios": {
            return validaCadastroFuncionarios()
        }
    }
}

function validaCadastroFuncionarios(){
    let validacoes = []
    validacoes.concat(validaCPF())
    validacoes.concat(validaNome())
    validacoes.concat(validaEmail())
    validacoes.concat(validaSenha())
    validacoes.concat(validaSalario())
    validacoes.concat(validaCidade())
    validacoes.concat(validaNivelAcesso())
    validacoes.concat(validaBairro())
    validacoes.concat(validaRua())
    validacoes.concat(validaNumeroCasa())
    validacoes.concat(validaComplemento())
    validacoes.concat(validaTelefone())
    validacoes.concat(validaDataNasc())
    return validacoes
}

function validaCPF() {
    let validacoes = []
    validacoes.push(validaNotNull(req, "cpf"))
    validacoes.push(validaFixoChars("cpf", 14))
    validacoes.push(body("cpf", "O atributo cpf deve estar no formato xxx.xxx.xxx-xx, onde x é um dígito.").matches(/^[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}$/))
    return validacoes
}

function validaNome() {
    let validacoes = [] 
    validacoes.push(validaNotNull("nome"))
    validacoes.push(validaMaxChars("nome", 100))
    return validacoes
}

function validaEmail() {
    let validacoes = []
    validacoes.push(validaNotNull("email"))
    validacoes.push(validaMaxChars("email", 255))
    validacoes.push(body("email", "O atributo email informado está em um formato inválido.").isEmail())
    return validacoes
}

function validaSenha() {
    let validacoes = []
    validacoes.push(validaNotNull("senha"))
    validacoes.push(validaMinMaxChars("senha", 8, 255))
    return validacoes
}

function validaSalario() {
    let validacoes = []
    validacoes.push(validaNotNull("salario"))
    validacoes.push(validaDecimal("salario", 0))
    return validacoes
}

function validaCidade() {
    let validacoes = []
    validacoes.push(validaNotNull("cidade"))
    validacoes.push(validaMaxChars("cidade", 30))
    return validacoes
}

function validaNivelAcesso() {
    let validacoes = []
    validacoes.push(validaNotNull("nivelAcesso"))
    validacoes.push(validaInteiro("nivelAcesso", 0, 2))
    return validacoes
}

function validaBairro(){
    let validacoes = []
    validacoes.push(validaNotNull("bairro"))
    validacoes.push(validaMaxChars("bairro", 25))
    return validacoes
}

function validaRua() {
    let validacoes = []
    validacoes.push(validaNotNull("rua"))
    validacoes.push(validaMaxChars("rua", 25))
    return validacoes
}

function validaNumeroCasa(){
    let validacoes = []
    validacoes.push(validaNotNull("numeroCasa"))
    validacoes.push(validaInteiro("numeroCasa", 0, 1000000))
    return validacoes
}

function validaComplemento(){
    let validacoes = []
    validacoes.push(validaMaxChars("complemento", 150).optional())
    return validacoes
}

function validaTelefone() {
    let validacoes = []
    validacoes.push(validaNotNull("telefone"))
    validacoes.push(validaMaxChars("telefone", 15))
    validacoes.push(body("telefone", "O atributo telefone deve estar no formato (xx) xxxxx-xxxx, onde x é um dígito.").matches(/^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}\-[0-9]{4}$/))
    return validacoes
}

function validaDataNasc() {
    let validacoes = []
    validacoes.push(validaNotNull("dataNasc"))
    validacoes.push(validaMaxChars("dataNasc", 10))
    validacoes.push(body("dataNasc", "O atributo dataNasc deve estar no formato aaaa-mm-dd").isISO8601())
    return validacoes
}

function validaNotNull(atributo) {
    return body(atributo, `É necessário informar o atributo ${atributo}.`).notEmpty()
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

function validaMinMaxChars(atributo, minimo) {
    return body(atributo, `O atributo ${atributo} deve conter no mínimo ${minimo} e no máximo ${maximo} caractéres.`).isLength({
        min: minimo,
        max: maximo
    })
}

function validaDecimal(atributo, minimo, maximo) {
    if (!minimo) {
        minimo = -1.79769e+308
    }

    if (!maximo) {
        maximo = 1.79769e+308
    }

    return body(atributo, `O atributo ${atributo} deve ser um número de ponto flutuante, com um "." separando a parte inteira da parte decimal, e conter um valor entre ${minimo} e ${maximo}`).isFloat({
        min: minimo,
        max: maximo
    })
}

function validaInteiro(atributo, minimo, maximo) {
    if (!minimo) {
        minimo = -9223372036854775808
    }

    if (!maximo) {
        maximo = 9223372036854775808
    }

    return body(atributo, `O atributo ${atributo} deve ser um número inteiro e conter um valor entre ${minimo} e ${maximo}`).isFloat({
        min: minimo,
        max: maximo
    })
}