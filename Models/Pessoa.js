const AlgoComEndereco = require("./AlgoComEndereco")

module.exports = class Pessoa extends AlgoComEndereco {
    constructor(nomeSingular, nomePlural, camposObrigatorios) {
        super(nomeSingular, nomePlural, camposObrigatorios.concat(["nome", "email"]))
    }

    async nomeAttr(novoNome, local) {
        await this._validaNotNull("nome", novoNome, local)
        await this._validaMinMaxChars("nome", novoNome, 1, 100, local)
        return novoNome
    }

    async emailAttr(novoEmail, local) {
        await this._validaNotNull("email", novoEmail, local)
        await this._validaMaxChars("email", novoEmail, 255, local)
        await this._validaCampoUnico("email", novoEmail, local)
        await this._validaRegex("email", novoEmail, /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, local)
        return novoEmail
    }

}