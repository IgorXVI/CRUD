const PessoaController = require("./PessoaController")
const { body } = require("express-validator/check")

module.exports = class PessoaJuridicaController extends PessoaController{
    constructor(nome, nomeSingular, atributos, gerarTodasRotas, masterDAO){
        super(nome, nomeSingular, ['CNPJ'].concat(atributos), gerarTodasRotas, masterDAO)
    }

    validaCNPJ(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("CNPJ"))
        }
        validacoes.push(this.validaFixoChars("CNPJ", 18))
        validacoes.push(body("CNPJ", "O valor deve estar no formato xx.xxx.xxx/xxxx-xx, onde x é um dígito.").matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/).optional())
        return validacoes
    }

}