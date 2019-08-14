const DAO = require("../database/DAO")
const nomesPlural = require("./nomesPlural")

module.exports = class Model {
    constructor(nomeSingular, nomePlural) {
        this.nomeSingular = nomeSingular
        this.nomePlural = nomePlural

        nomesPlural[nomeSingular] = nomePlural

        this._lidarComErro = this._lidarComErro.bind(this)
        this._gerarAtributosJSON = this._gerarAtributosJSON.bind(this)

        this._DAO = new DAO(nomePlural)
        this.errosValidacao = []
    }

    async buscaTodos() {
        let arr = await this._DAO.buscaTodos()
        for (let i = 0; i < arr.length; i++) {
            arr[i] = this._buscaObjetoPorID(arr[i].id, this._DAO)
        }
        return Promise.all(arr)
    }

    async deletaUm(id) {
        const ID = await this.id(id)
        const info = await this._DAO.deletaPorColuna(ID, "id")
        if (info.changes === 0) {
            throw new Error(await this._formataErro("id", this.JSON.id, "ID inválido."))
        }
    }

    async buscaUm(id) {
        const ID = await this.id(id)
        return await this._buscaObjetoPorID(ID, this._DAO)
    }

    async adicionaUm(objeto) {
        const o = await this._gerarAtributosJSON(objeto)
        delete o.id
        await this._DAO.adiciona(o)
    }

    async atualizaUm(objeto, id) {
        const o = await this._gerarAtributosJSON(objeto)
        o.id = await this.id(id)
        const info = await this._DAO.atualizaPorColuna(o, "id")
        if (info.changes === 0) {
            throw new Error(await this._formataErro("id", this.JSON.id, "ID inválido."))
        }
    }

    async id(novoId) {
        await this._validaInteiro("id", novoId, 1)
        await this._validaExiste(this._DAO, "id", novoId)
        return novoId
    }

    async _gerarAtributosJSON(objeto) {
        this.errosValidacao = []
        const keys = Object.keys(objeto)
        let o = {}
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            try {
                if (this[key] === undefined || this[key] === null) {
                    throw new Error(await this._formataErro(key, undefined, "Parâmetro inválido."))
                }
                o[key] = await this[key](objeto[key])
            } catch (e) {
                this.errosValidacao.push(JSON.parse(e.message))
            }
        }
        if (this.errosValidacao.length > 0) {
            throw new Error(await this._formataErro(undefined, this.errosValidacao, "Erros de validação."))
        }
        return o
    }

    async _buscaObjetoPorID(id, DAO) {
        let objeto = await DAO.buscaPorColuna(id, "id")
        if (!objeto) {
            if (id === this.JSON.id) {
                throw new Error(await this._formataErro("id", this.JSON.id, "ID inválido."))
            }
            console.log({
                id,
                DAO
            })
            throw new Error("Erro: erro que nao poderia acontecer.")
        } else {
            objeto = await this._converterForeignKeyEmJSON(objeto)
            return objeto
        }
    }

    async _converterForeignKeyEmJSON(objetoRecebido) {
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
    }

    async _formataErro(param, value, msg) {
        let erroFormatado = {
            msg,
            param,
            value
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

    async _validaCampoUnico(DAO, atributo, valor) {
        const objeto = await DAO.buscaPorColuna(valor, atributo)
        if (objeto) {
            throw new Error(await this._formataErro(atributo, valor, "O valor informado já está cadastrado."))
        }
    }

    async _validaExiste(DAO, atributo, valor) {
        const objeto = await DAO.buscaPorColuna(valor, "id")
        if (!objeto) {
            throw new Error(await this._formataErro(atributo, valor, "O valor informado não está cadastrado."))
        }
    }

    async _validaNotNull(atributo, valor) {
        if (valor === undefined || valor === null) {
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

        if (!(Number(valor) == valor && valor % 1 == 0) || valor.length > maximo || valor.length < minimo) {
            throw new Error(await this._formataErro(atributo, valor, `O valor deve ser um número inteiro e estar entre ${minimo} e ${maximo}`))
        }
    }

    async _validaDataISO8601(atributo, valor) {
        try {
            Date.parse(valor)
        } catch (e) {
            throw new Error(await this._formataErro(atributo, valor, `O valor deve estar no formato ISO8601.`))
        }
    }

    async _validaRegex(atributo, valor, regex) {
        if (!regex.test(valor)) {
            throw new Error(await this._formataErro(atributo, valor, `O valor está em um formato inválido.`))
        }
    }

    async _validaArray(atributo, valor) {
        if (!(valor instanceof Array)) {
            throw new Error(await this._formataErro(atributo, valor, "O valor deve ser um array."))
        }
    }
}