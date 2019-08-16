const Pessoa = require("./Pessoa")

module.exports = class PessoaJuridica extends Pessoa {
    constructor(nomeSingular, nomePlural) {
        super(nomeSingular, nomePlural)
    }

    async CNPJAttr(novoCNPJ) {
        await this._validaNotNull("CNPJ", novoCNPJ)
        await this._validaFixoChars("CNPJ", novoCNPJ, 18)
        await this._validaRegex("CNPJ", novoCNPJ, /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)
        return novoCNPJ
    }

}