const Model = require("./Model")

module.exports = class AlgoComEndereco extends Model {
    constructor(nomeSingular, nomePlural) {
        super(nomeSingular, nomePlural)

        this._cidade = ""
        this._bairro = ""
        this._rua = ""
        this._numeroCasa = 0
        this._telefone = ""
        this._complemento = ""
    }

    async cidade(novaCidade) {
        await this._validaNotNull("cidade", novaCidade)
        await this._validaInteiro("cidade", novaCidade, 1)
        this._cidade = novaCidade
    }

    async bairro(novoBairro) {
        await this._validaNotNull("bairro", novoBairro)
        await this._validaMinMaxChars("bairro", novoBairro, 1, 25)
        this._bairro = novoBairro
    }

    async rua(novaRua) {
        await this._validaNotNull("rua", novaRua)
        await this._validaMinMaxChars("rua", novaRua, 1, 25)
        this._rua = novaRua
    }

    async numeroCasa(novoNumeroCasa) {
        await this._validaNotNull("numeroCasa", novoNumeroCasa)
        await this._validaInteiro("numeroCasa", novoNumeroCasa, 0, 1000000)
        this._numeroCasa = novoNumeroCasa
    }

    async telefone(novoTelefone) {
        await this._validaNotNull("telefone", novoTelefone)
        await this._validaMaxChars("telefone", novoTelefone, 15)
        await this._validaRegex("telefone", novoTelefone, /^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}-[0-9]{4}$/)
        this._telefone = novoTelefone
    }

    async complemento(novoComplemento){
       await this._validaMaxChars("complemento", novoComplemento, 150)
       this._complemento = novoComplemento
    }

}