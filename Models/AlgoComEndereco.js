const Model = require("./Model")
const Cidades = require("./Cidades")

module.exports = class AlgoComEndereco extends Model {
    constructor(nomeSingular, nomePlural) {
        super(nomeSingular, nomePlural)
    }

    async cidade(novaCidade) {
        const cidades = new Cidades()
        return cidades.id(novaCidade)
    }

    async bairro(novoBairro) {
        await this._validaNotNull("bairro", novoBairro)
        await this._validaMinMaxChars("bairro", novoBairro, 1, 25)
        return novoBairro
    }

    async rua(novaRua) {
        await this._validaNotNull("rua", novaRua)
        await this._validaMinMaxChars("rua", novaRua, 1, 25)
        return novaRua
    }

    async numeroCasa(novoNumeroCasa) {
        await this._validaNotNull("numeroCasa", novoNumeroCasa)
        await this._validaInteiro("numeroCasa", novoNumeroCasa, 0, 1000000)
        return novoNumeroCasa
    }

    async telefone(novoTelefone) {
        await this._validaNotNull("telefone", novoTelefone)
        await this._validaMaxChars("telefone", novoTelefone, 15)
        await this._validaRegex("telefone", novoTelefone, /^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}-[0-9]{4}$/)
        return novoTelefone
    }

    async complemento(novoComplemento){
       await this._validaMaxChars("complemento", novoComplemento, 150)
       return novoComplemento
    }

}