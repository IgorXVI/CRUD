const Pessoa = require("./Pessoa")

module.exports = class PessoaFisica extends Pessoa {
    constructor(nomeSingular, nomePlural) {
        super(nomeSingular, nomePlural)

        Object.assign(this.attrsValidacao, {
            CPF: this._validaCPF,
            dataNascimento: this._validaDataNascimento
        })
    }

    async _validaCPF(novoCPF, local) {
        await this._validaNotNull("CPF", novoCPF, local)
        await this._validaFixoChars("CPF", novoCPF, 14, local)
        await this._validaRegex("CPF", novoCPF, /^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$/, local)
    }

    async _validaDataNascimento(novaDataNascimento, local) {
        await this._validaNotNull("dataNascimento", novaDataNascimento, local)
        await this._validaMaxChars("dataNascimento", novaDataNascimento, 10, local)
        await this._validaDataISO8601("dataNascimento", novaDataNascimento, local)
    }

}