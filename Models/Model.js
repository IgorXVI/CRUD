const DAO = require("../database/DAO")
const nomesPlural = require("./nomesPlural")

module.exports = class Model {
    constructor(nomeSingular, nomePlural) {
        this.nomeSingular = nomeSingular
        this.nomePlural = nomePlural

        nomesPlural[nomeSingular] = nomePlural

        this._lidarComErro = this._lidarComErro.bind(this)
        this.gerarAtributosJSON = this.gerarAtributosJSON.bind(this)

        this._id = 0
        this._DAO = new DAO(nomePlural)
        this._errosValidacao = []
    }

    async id(novoId) {
        await this._validaInteiro("id", novoId, 1)
        this._id = novoId
    }

    async _gerarAtributosJSON(objeto) {
        try {
            let o = {}
            const keys = Object.keys(objeto)
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i]
                try {
                    if (!this[key]) {
                        throw new Error(this._formataErro(key, objeto[key], "Parâmetro inválido."))
                    } else {
                        o[key] = objeto[key]
                        await this[key](objeto[key])
                    }
                } catch (e) {
                    this._errosValidacao.push(JSON.parse(e))
                }
            }
            if (this._errosValidacao.length > 0) {
                throw new Error("Erro: erros de validação.")
            } else {
                return o
            }
        } catch (err) {
            throw new Error(await this._lidarComErro(err))
        }
    }

    async buscaTodos() {
        try {
            let arr = await this._DAO.buscaTodos()
            for (let i = 0; i < arr.length; i++) {
                arr[i] = await this._buscaObjetoPorID(arr[i].id, this._DAO)
            }
            return arr
        } catch (e) {
            throw new Error(await this._lidarComErro(e))
        }
    }

    async deletaUm() {
        try {
            const info = await this._DAO.deletaPorColuna(this._id, "id")
            if(info.changes === 0){
                throw new Error("Erro: ID nao existe.")
            }
        } catch (e) {
            throw new Error(await this._lidarComErro(e))
        }
    }

    async buscaUm() {
        try {
            return await this._buscaObjetoPorID(this._id, this._DAO)
        } catch (e) {
            throw new Error(await this._lidarComErro(e))
        }
    }

    async adicionaUm(objeto) {
        try {
            const o = await this._gerarAtributosJSON(objeto)
            await this._DAO.adiciona(o)
        } catch (e) {
            throw new Error(await this._lidarComErro(e))
        }
    }

    async atualizaUm(objeto) {
        try {
            let o = await this._gerarAtributosJSON(objeto)
            const keys = Object.keys(o)

            const objetoDB = await this._buscaObjetoPorID(this._id, this._DAO)

            for (let i = 0; i < keys.length; i++) {
                if (!o[keys[i]]) {
                    o[keys[i]] = objetoDB[keys[i]]
                }
            }

            await this._DAO.atualizaPorColuna(o, this._id, "id")
        } catch (e) {
            throw new Error(await this._lidarComErro(e))
        }
    }

    async _buscaObjetoPorID(id, DAO) {
        try {
            let objeto = await DAO.buscaPorColuna(id, "id")
            if (!objeto) {
                if (id === this._id) {
                    throw new Error("Erro: ID nao existe.")
                } else {
                    console.log({
                        id,
                        DAO
                    })
                    throw new Error("Erro: erro que nao poderia acontecer.")
                }
            } else {
                objeto = await this._converterForeignKeyEmJSON(objeto)
                return objeto
            }
        } catch (e) {
            throw new Error(await this._lidarComErro(e))
        }
    }

    async _converterForeignKeyEmJSON(objetoRecebido) {
        try {
            let objeto = objetoRecebido
            const keys = Object.keys(objeto)

            for (let i = 0; i < keys.length; i++) {
                if (Object.keys(nomesPlural).includes(keys[i])) {
                    let nomeSingular = keys[i]
                    let nomePlural = nomesPlural[nomeSingular]

                    const resultado = await this._buscaObjetoPorID(objeto[nomeSingular], new DAO(nomePlural))

                    objeto[nomeSingular] = resultado
                }
            }
            return objeto
        } catch (e) {
            throw new Error(await this._lidarComErro(e))
        }
    }

    async _formataErro(param, value, msg) {
        let erroFormatado = {
            param,
            value,
            msg
        }
        const keys = Object.keys(erroFormatado)
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            if (!erroFormatado[key]) {
                delete erroFormatado[key]
            }
        }
        return JSON.stringify(erroFormatado)
    }

    async _lidarComErro(erro) {
        if (erro.message.includes("FOREIGN KEY constraint failed")) {
            return this._formataErro(undefined, undefined, "Erro de Foreign Key.")
        } 
        else if(erro.message.includes("UNIQUE constraint failed")){
            return this._formataErro(undefined, undefined, "Erro de valor único.")
        }
        else if (erro.message.includes("Erro: ID nao existe.")) {
            return this._formataErro("id", this._id, "O valor informado não está cadastrado.")
        } 
        else if (erro.message.includes("Erro: erros de validação.")) {
            return JSON.stringify(this._errosValidacao)
        } else {
            console.log(erro)
            return this._formataErro(undefined, undefined, undefined, "Erro no servidor.")
        }
    }

    async _validaCampoUnico(DAO, atributo, valor) {
        const objeto = await DAO.buscaPorColuna(valor, atributo)
        if (objeto) {
            throw new Error(await this._formataErro(atributo, valor, "O valor informado já está cadastrado."))
        }
    }

    async _validaNotNull(atributo, valor) {
        if (!valor) {
            throw new Error(await this._formataErro(atributo, valor, "O valor informado não pode ser nulo."))
        }
    }

    async _validaFixoChars(atributo, valor, numero) {
        if (valor.length > numero || valor.length < numero) {
            throw new Error(await this._formataErro(atributo, valor, `O valor deve conter ${numero} caractéres.`))
        }
    }

    async _validaMaxChars(atributo, valor, numero) {
        if (valor.length > numero) {
            throw new Error(await this._formataErro(atributo, valor, `O valor deve conter no máximo ${numero} caractéres.`))
        }
    }

    async _validaMinMaxChars(atributo, valor, minimo, maximo) {
        if (valor.length > maximo || valor.length < minimo) {
            throw new Error(await this._formataErro(atributo, valor, `O valor deve conter no mínimo ${minimo} e no máximo ${maximo} caractéres.`))
        }
    }

    async _validaDecimal(atributo, valor, minimo, maximo) {
        if (minimo == null) {
            minimo = -1.79769e+308
        }

        if (maximo == null) {
            maximo = 1.79769e+308
        }

        if (!(Number(valor) === valor && valor % 1 !== 0) || valor.length > maximo || valor.length < minimo) {
            throw new Error(await this._formataErro(atributo, valor, `O valor deve ser um número de ponto flutuante, com um ponto separando a parte inteira da parte decimal, e estar entre ${minimo} e ${maximo}`))
        }
    }

    async _validaInteiro(atributo, valor, minimo, maximo) {
        if (minimo == null) {
            minimo = -9223372036854775808
        }

        if (maximo == null) {
            maximo = 9223372036854775808
        }

        if (!(Number(valor) === valor && valor % 1 === 0) || valor.length > maximo || valor.length < minimo) {
            throw new Error(await this._formataErro(atributo, valor, `O valor deve ser um número inteiro e estar entre ${minimo} e ${maximo}`))
        }
    }

    async _validaDataISO8601(atributo, valor) {
        const dataParsed = new Date(Date.parse(valor))
        if (dataParsed.toISOString() !== valor) {
            throw new Error(await this._formataErro(atributo, valor, `O valor deve estar no formato ISO8601.`))
        }
    }

    async _validaRegex(atributo, valor, regex){
        if(!regex.test(valor)){
            throw new Error(await this._formataErro(atributo, valor, `O valor está em um formato inválido.`))
        }
    }
}