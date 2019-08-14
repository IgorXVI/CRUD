const Model = require("./Model")

module.exports = class Cidades extends Model{
    constructor(){
        super("cidade", "cidades")
    }

    async nome(novoNome){
        await this._validaNotNull("nome", novoNome)
        await this._validaMinMaxChars("nome", novoNome, 1, 100)
        return novoNome
    }

    async pais(novoPais) {
        await this._validaNotNull("pais", novoPais)
        await this._validaFixoChars("pais", novoPais, 2)
        return novoPais
    }

    async latitude(novaLatitude){
        await this._validaNotNull("latitude", novaLatitude)
        await this._validaInteiro("latitude", novaLatitude)
        return novaLatitude
    }

    async longitude(novaLongitude){
        await this._validaNotNull("longitude", novaLongitude)
        await this._validaInteiro("longitude", novaLongitude)
        return novaLongitude
    }

}