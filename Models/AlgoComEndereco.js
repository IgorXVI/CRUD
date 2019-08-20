const Model = require("./Model")

module.exports = class AlgoComEndereco extends Model {
    constructor(nomeSingular, nomePlural) {
        super(nomeSingular, nomePlural)

        Object.assign(this.attrs, {
            cidade: {
                validacao: this._validaCidade,
                sql: `INTEGER NOT NULL`,
                fk: {
                    tabela: `cidades`,
                    attr: `id`
                }
            },
            bairro: {
                validacao: this._validaBairro,
                sql: `VARCHAR(25) NOT NULL`
            },
            rua: {
                validacao: this._validaRua,
                sql: `VARCHAR(25) NOT NULL`
            },
            numeroCasa: {
                validacao: this._validaNumeroCasa,
                sql: `INTEGER NOT NULL`
            },
            telefone: {
                validacao: this._validaTelefone,
                sql: `VARCHAR(15) NOT NULL`
            },
            complemento: {
                validacao: this._validaComplemento,
                sql: `VARCHAR(255)`
            }
        })
    }

    async _validaCidade(novaCidade, local) {
        await this._validaFK("cidade", "cidades", novaCidade, local)
    }

    async _validaBairro(novoBairro, local) {
        await this._validaNotNull("bairro", novoBairro, local)
        await this._validaMinMaxChars("bairro", novoBairro, 1, 25, local)
    }

    async _validaRua(novaRua, local) {
        await this._validaNotNull("rua", novaRua, local)
        await this._validaMinMaxChars("rua", novaRua, 1, 25, local)
    }

    async _validaNumeroCasa(novoNumeroCasa, local) {
        await this._validaNotNull("numeroCasa", novoNumeroCasa, local)
        await this._validaInteiro("numeroCasa", novoNumeroCasa, 0, 1000000, local)
    }

    async _validaTelefone(novoTelefone, local) {
        await this._validaNotNull("telefone", novoTelefone, local)
        await this._validaMaxChars("telefone", novoTelefone, 15, local)
        await this._validaRegex("telefone", novoTelefone, /^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}-[0-9]{4}$/, local)
    }

    async _validaComplemento(novoComplemento, local) {
        if (novoComplemento) {
            await this._validaMaxChars("complemento", novoComplemento, 150, local)
        }
    }

}