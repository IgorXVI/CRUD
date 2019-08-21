const Pessoa = require("./Pessoa")

module.exports = class PessoaFisica extends Pessoa {
    constructor(nomeSingular, nomePlural) {
        super(nomeSingular, nomePlural)

        Object.assign(this.attrs, {
            CPF: {
                validacaoAttr: this._validaCPFAttr,
                validacaoQuery: this._validaCPF,
                sql: `VARCHAR(14) NOT NULL UNIQUE`
            },
            dataNascimento: {
                validacao: this._validaDataNascimento,
                sql: `VARCHAR(10) NOT NULL`
            }
        })
    }

    async _validaCPF(novoCPF, local) {
        await this._validaNotNull("CPF", novoCPF, local)
        await this._validaFixoChars("CPF", novoCPF, 14, local)
        await this._validaRegex("CPF", novoCPF, /^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$/, local)
    }

    async _validaCPFAttr(novoCPF, local){
        await this._validaCPF(novoCPF, local)
        await this._validaCampoUnico("CPF", novoCPF, local)
    }

    async _validaDataNascimento(novaDataNascimento, local) {
        await this._validaNotNull("dataNascimento", novaDataNascimento, local)
        await this._validaMaxChars("dataNascimento", novaDataNascimento, 10, local)
        await this._validaDataISO8601("dataNascimento", novaDataNascimento, local)
    }

}