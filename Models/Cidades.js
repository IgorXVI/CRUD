const Model = require("./Model")

module.exports = class Cidades extends Model{
    constructor(){
        super("cidade", "cidades")

        this.JSON.nome = ""
        this.JSON.UF = ""
        this.JSON.CEP = ""
    }

    async nome(novoNome){
        await this._validaNotNull("nome", novoNome)
        await this._validaMinMaxChars("nome", novoNome, 1, 100)
        this.JSON.nome = novoNome
    }

    async UF(novoUF) {
        await this._validaNotNull("UF", novoUF)
        await this._validaFixoChars("UF", novoUF, 2)
        this.JSON.UF = novoUF
    }

    async CEP(novoCEP){
        await this._validaNotNull("CEP", novoCEP)
        await this._validaFixoChars("CEP", novoCEP, 9)
        await this._validaRegex("CEP", novoCEP, /^[0-9]{5}-[\d]{3}$/)
        this.JSON.CEP = novoCEP
    }

}