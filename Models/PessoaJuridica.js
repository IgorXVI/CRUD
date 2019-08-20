const Pessoa = require("./Pessoa")

module.exports = class PessoaJuridica extends Pessoa {
    constructor(nomeSingular, nomePlural, camposObrigatorios) {
        super(nomeSingular, nomePlural, camposObrigatorios.concat(["CPNPJ"]))
    }

    async CNPJAttr(novoCNPJ, local) {
        await this._validaNotNull("CNPJ", novoCNPJ, local)
        await this._validaFixoChars("CNPJ", novoCNPJ, 18, local)
        await this._validaRegex("CNPJ", novoCNPJ, /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, local)
        return novoCNPJ
    }

}