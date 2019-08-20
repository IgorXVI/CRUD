const Pessoa = require("./Pessoa")

module.exports = class PessoaFisica extends Pessoa {
    constructor(nomeSingular, nomePlural, camposObrigatorios) {
        super(nomeSingular, nomePlural, camposObrigatorios.concat(["CPF", "dataNascimento"]))
    }

    async CPFAttr(novoCPF, local) {
        await this._validaNotNull("CPF", novoCPF, local)
        await this._validaFixoChars("CPF", novoCPF, 14, local)
        await this._validaRegex("CPF", novoCPF, /^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$/, local)
        return novoCPF
    }

    async dataNascimentoAttr(novaDataNascimento, local) {
        await this._validaNotNull("dataNascimento", novaDataNascimento, local)
        await this._validaMaxChars("dataNascimento", novaDataNascimento, 10, local)
        await this._validaDataISO8601("dataNascimento", novaDataNascimento, local)
        return novaDataNascimento
    }

}