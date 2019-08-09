const AlgoComEndereco = require("./AlgoComEndereco")

module.exports = class Pessoa extends AlgoComEndereco {
    constructor(nomeSingular, nomePlural) {
        super(nomeSingular, nomePlural)

        this._email = ""
        this._nome = ""
    }

    async nome(novoNome) {
        await this._validaNotNull("nome", novoNome)
        await this._validaMinMaxChars("nome", novoNome, 1, 100)
        this._nome = novoNome
    }

    async email(novoEmail) {
        await this._validaNotNull("email", novoEmail)
        await this._validaMaxChars("email", novoEmail, 255)
        await this._validaCampoUnico(this._DAO, "email", novoEmail)
        await this._validaRegex("email", novoEmail, /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
        this._email = novoEmail
    }

}