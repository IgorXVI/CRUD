const PessoaController = require("./PessoaController")
const { body } = require("express-validator/check")

module.exports = class PessoaFisicaController extends PessoaController{
    constructor(nome, nomeSingular, atributos, gerarTodasRotas, masterDAO){
        super(nome, nomeSingular, ['CPF', 'dataNasc'].concat(atributos), gerarTodasRotas, masterDAO)
    }

    validaCPF(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("CPF"))
        }
        validacoes.push(this.validaFixoChars("CPF", 14))
        validacoes.push(body("CPF", "O valor deve estar no formato xxx.xxx.xxx-xx, onde x é um dígito.").matches(/^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$/).optional())
        return validacoes
    }

    validaDataNasc(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("dataNasc"))
        }
        validacoes.push(this.validaMaxChars("dataNasc", 10))
        validacoes.push(this.validaDataISO8601("dataNasc"))
        return validacoes
    }

}