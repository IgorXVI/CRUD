const AlgoComEnderecoController = require("./AlgoComEnderecoController")
const { body } = require("express-validator/check")

module.exports = class PessoaController extends AlgoComEnderecoController{
    constructor(nome, nomeSingular, atributos, gerarTodasRotas, masterDAO){
        super(nome, nomeSingular, ['nome','email'].concat(atributos), gerarTodasRotas, masterDAO)
    }

    validaNome(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("nome"))
        }
        validacoes.push(this.validaMinMaxChars("nome", 1, 100))
        return validacoes
    }

    validaEmail(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("email"))
        }
        validacoes.push(this.validaMaxChars("email", 255))
        validacoes.push(body("email", "O valor informado está em um formato inválido.").isEmail().optional())
        validacoes.push(this.validaCampoUnico(this.masterDAO, "email"))
        return validacoes
    }

}