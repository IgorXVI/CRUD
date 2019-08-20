const Model = require("./Model")

module.exports = class Cidades extends Model{
    constructor(){
        super("cidade", "cidades", ["nome", "pais", "latitude", "longitude"])
    }

    async nomeAttr(novoNome, local){
        await this._validaNotNull("nome", novoNome, local)
        await this._validaMinMaxChars("nome", novoNome, 1, 100, local)
        return novoNome
    }

    async paisAttr(novoPais, local) {
        await this._validaNotNull("pais", novoPais, local)
        await this._validaFixoChars("pais", novoPais, 2, local)
        return novoPais
    }

    async latitudeAttr(novaLatitude, local){
        await this._validaNotNull("latitude", novaLatitude, local)
        await this._validaDecimal("latitude", novaLatitude, -90, 90, local)
        return novaLatitude
    }

    async longitudeAttr(novaLongitude, local){
        await this._validaNotNull("longitude", novaLongitude, local)
        await this._validaDecimal("longitude", novaLongitude, -180, 180, local)
        return novaLongitude
    }

}