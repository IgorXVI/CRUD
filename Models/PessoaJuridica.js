const Pessoa = require("./Pessoa")

module.exports = class PessoaJuridica extends Pessoa {
    constructor(nomeSingular, nomePlural) {
        super(nomeSingular, nomePlural)

        Object.assign(this.attrs, {
            CNPJ: {
                validacao: this._validaCNPJ,
                sql: `VARCHAR(18) NOT NULL UNIQUE`
            }
        })
    }

    async _validaCNPJ(novoCNPJ, local) {
        await this._validaNotNull("CNPJ", novoCNPJ, local)
        await this._validaFixoChars("CNPJ", novoCNPJ, 18, local)
        await this._validaCampoUnico("CNPJ", novoCNPJ, local)
        await this._validaRegex("CNPJ", novoCNPJ, /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, local)
    }

}