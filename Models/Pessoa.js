const AlgoComEndereco = require("./AlgoComEndereco")

module.exports = class Pessoa extends AlgoComEndereco {
    constructor(nomeSingular, nomePlural) {
        super(nomeSingular, nomePlural)

        Object.assign(this.attrsValidacao, {
            nome: {
                validacao: this._validaNome,
                sql: `VARCHAR(30) NOT NULL`
            },
            email: {
                validacao: this._validaEmail,
                sql: `VARCHAR(255) NOT NULL UNIQUE`
            }
        })
    }

    async _validaNome(novoNome, local) {
        await this._validaNotNull("nome", novoNome, local)
        await this._validaMinMaxChars("nome", novoNome, 1, 100, local)
    }

    async _validaEmail(novoEmail, local) {
        await this._validaNotNull("email", novoEmail, local)
        await this._validaMaxChars("email", novoEmail, 255, local)
        await this._validaCampoUnico("email", novoEmail, local)
        await this._validaRegex("email", novoEmail, /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, local)
    }

}