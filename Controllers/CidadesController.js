const Controller = require("./Controller")
const CidadesDAO = require("../DAOs/CidadesDAO")
const { body } = require("express-validator/check")
module.exports = class CidadesController extends Controller {
    constructor() {
        super(`cidades`, `cidade`, [`nome`, `UF`, `CEP`], true, new CidadesDAO())
    }

    validaUF(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("UF"))
        }
        validacoes.push(this.validaFixoChars("UF", 2).optional())
        return validacoes
    }

    validaCEP(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("CEP"))
        }
        validacoes.push(this.validaFixoChars("CEP", 9).optional())
        validacoes.push(body("CEP", "O valor deve estar no formato xxxxx-xxx, onde x é um dígito.").matches(/^[0-9]{5}-[\d]{3}$/).optional())
        return validacoes
    }

}