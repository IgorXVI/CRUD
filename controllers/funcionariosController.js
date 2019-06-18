const dbConnection = require("../database/db")
const validacao = require("./validacao")

function validaCadastro(){
    let validacoes = new Array()
    validacoes = validacoes.concat(validacao.validaCPF())
    validacoes = validacoes.concat(validacao.validaNome())
    validacoes = validacoes.concat(validacao.validaEmail())
    validacoes = validacoes.concat(validacao.validaSenha())
    validacoes = validacoes.concat(validacao.validaSalario())
    validacoes = validacoes.concat(validacao.validaCidade())
    validacoes = validacoes.concat(validacao.validaNivelAcesso())
    validacoes = validacoes.concat(validacao.validaBairro())
    validacoes = validacoes.concat(validacao.validaRua())
    validacoes = validacoes.concat(validacao.validaNumeroCasa())
    validacoes = validacoes.concat(validacao.validaComplemento())
    validacoes = validacoes.concat(validacao.validaTelefone())
    validacoes = validacoes.concat(validacao.validaDataNasc())
    return validacoes
}

module.exports = {
    validaCadastro
}