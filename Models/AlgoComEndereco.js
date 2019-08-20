const Model = require("./Model")

module.exports = class AlgoComEndereco extends Model {
    constructor(nomeSingular, nomePlural, camposObrigatorios) {
        super(nomeSingular, nomePlural, camposObrigatorios.concat(["cidade", "bairro", "rua", "numeroCasa", "telefone", "complemento"]))
    }

    async cidadeAttr(novaCidade, local) {
        await this._validaFK("cidade", "cidades", novaCidade, local)
        return novaCidade
    }

    async bairroAttr(novoBairro, local) {
        await this._validaNotNull("bairro", novoBairro, local)
        await this._validaMinMaxChars("bairro", novoBairro, 1, 25, local)
        return novoBairro
    }

    async ruaAttr(novaRua, local) {
        await this._validaNotNull("rua", novaRua, local)
        await this._validaMinMaxChars("rua", novaRua, 1, 25, local)
        return novaRua
    }

    async numeroCasaAttr(novoNumeroCasa, local) {
        await this._validaNotNull("numeroCasa", novoNumeroCasa, local)
        await this._validaInteiro("numeroCasa", novoNumeroCasa, 0, 1000000, local)
        return novoNumeroCasa
    }

    async telefoneAttr(novoTelefone, local) {
        await this._validaNotNull("telefone", novoTelefone, local)
        await this._validaMaxChars("telefone", novoTelefone, 15, local)
        await this._validaRegex("telefone", novoTelefone, /^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}-[0-9]{4}$/, local)
        return novoTelefone
    }

    async complementoAttr(novoComplemento, local){
       await this._validaMaxChars("complemento", novoComplemento, 150, local)
       return novoComplemento
    }

}