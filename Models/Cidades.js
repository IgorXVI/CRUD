const Model = require("./Model")

module.exports = class Cidades extends Model {
    constructor() {
        super("cidade", "cidades")

        Object.assign(this.attrsValidacao, {
            nome: {
                validacao: this._validaNome,
                sql: `VARCHAR(30) NOT NULL`
            },
            pais: {
                validacao: this._validaPais,
                sql: `VARCHAR(2) NOT NULL`
            },
            latitude: {
                validacao: this._validaLatitude,
                sql: `REAL NOT NULL`
            },
            longitude: {
                validacao: this._validaLongitude,
                sql: `REAL NOT NULL`
            }
        })

        this._gerarSchema()
    }

    async _validaNome(novoNome, local) {
        await this._validaNotNull("nome", novoNome, local)
        await this._validaMinMaxChars("nome", novoNome, 1, 30, local)
    }

    async _validaPais(novoPais, local) {
        await this._validaNotNull("pais", novoPais, local)
        await this._validaFixoChars("pais", novoPais, 2, local)
    }

    async _validaLatitude(novaLatitude, local) {
        await this._validaNotNull("latitude", novaLatitude, local)
        await this._validaDecimal("latitude", novaLatitude, -90, 90, local)
    }

    async _validaLongitude(novaLongitude, local) {
        await this._validaNotNull("longitude", novaLongitude, local)
        await this._validaDecimal("longitude", novaLongitude, -180, 180, local)
    }

}