const Model = require("./Model")
const DAO = require("../database/DAO")

module.exports = class AlgoComEndereco extends Model {
    constructor(nomeSingular, nomePlural) {
        super(nomeSingular, nomePlural)

        this.JSON.cidade = ""
        this.JSON.bairro = ""
        this.JSON.rua = ""
        this.JSON.numeroCasa = 0
        this.JSON.telefone = ""
        this.JSON.complemento = ""
    }

    async cidade(novaCidade) {
        await this._validaNotNull("cidade", novaCidade)
        await this._validaInteiro("cidade", novaCidade, 1)
        await this._validaExiste(new DAO("cidades"), "cidade", novaCidade)
        this.JSON.cidade = novaCidade
    }

    async bairro(novoBairro) {
        await this._validaNotNull("bairro", novoBairro)
        await this._validaMinMaxChars("bairro", novoBairro, 1, 25)
        this.JSON.bairro = novoBairro
    }

    async rua(novaRua) {
        await this._validaNotNull("rua", novaRua)
        await this._validaMinMaxChars("rua", novaRua, 1, 25)
        this.JSON.rua = novaRua
    }

    async numeroCasa(novoNumeroCasa) {
        await this._validaNotNull("numeroCasa", novoNumeroCasa)
        await this._validaInteiro("numeroCasa", novoNumeroCasa, 0, 1000000)
        this.JSON.numeroCasa = novoNumeroCasa
    }

    async telefone(novoTelefone) {
        await this._validaNotNull("telefone", novoTelefone)
        await this._validaMaxChars("telefone", novoTelefone, 15)
        await this._validaRegex("telefone", novoTelefone, /^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}-[0-9]{4}$/)
        this.JSON.telefone = novoTelefone
    }

    async complemento(novoComplemento){
       await this._validaMaxChars("complemento", novoComplemento, 150)
       this.JSON.complemento = novoComplemento
    }

}