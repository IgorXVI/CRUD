const Model = require("./Model")

module.exports = class Cidades extends Model{
    constructor(){
        super("cidade", "cidades")
    }

    async nomeAttr(novoNome){
        await this._validaNotNull("nome", novoNome)
        await this._validaMinMaxChars("nome", novoNome, 1, 100)
        return novoNome
    }

    async paisAttr(novoPais) {
        await this._validaNotNull("pais", novoPais)
        await this._validaFixoChars("pais", novoPais, 2)
        return novoPais
    }

    async latitudeAttr(novaLatitude){
        await this._validaNotNull("latitude", novaLatitude)
        await this._validaDecimal("latitude", novaLatitude, -90, 90)
        return novaLatitude
    }

    async longitudeAttr(novaLongitude){
        await this._validaNotNull("longitude", novaLongitude)
        await this._validaDecimal("longitude", novaLongitude, -180, 180)
        return novaLongitude
    }

}