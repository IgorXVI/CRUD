const DAO = require("../database/DAO")
const sanitizer = require('sanitizer')
const nomesPlural = require("./nomesPlural")

module.exports = class Model {
    constructor(nomeSingular, nomePlural) {
        this.nomeSingular = nomeSingular
        this.nomePlural = nomePlural

        this._gerarAtributosJSON = this._gerarAtributosJSON.bind(this)

        nomesPlural[nomeSingular] = nomePlural

        this._DAO = new DAO(nomePlural)
        this.errosValidacao = []
    }

    async busca(query) {
        const q = await this._gerarQueryJSON(query, true)
        let arr = await this._DAO.busca(q)
        for (let i = 0; i < arr.length; i++) {
            arr[i] = this._converterForeignKeyEmJSON(arr[i])
        }
        return Promise.all(arr)
    }

    async buscaUm(id) {
        const ID = await this.id(id)
        let objeto = await this._DAO.busca({
            id: ID
        })
        return this._converterForeignKeyEmJSON(objeto)
    }

    async deleta(query) {
        const q = await this._gerarQueryJSON(query, true)
        await this._DAO.deleta(q)
    }

    async deletaUm(id) {
        const ID = await this.id(id)
        await this._DAO.deleta({
            id: ID
        })
    }

    async atualiza(objeto, query) {
        const o = await this._gerarAtributosJSON(objeto)
        const q = await this._gerarQueryJSON(query, true)
        await this._DAO.atualiza(o, q)
    }

    async atualizaUm(objeto, id) {
        const o = await this._gerarAtributosJSON(objeto)
        const ID = await this.id(id)
        await this._DAO.atualiza(o, {
            id: ID
        })
    }

    async adiciona(listaObjetos) {
        let l = []
        for (let i = 0; i < listaObjetos.length; i++) {
            l.push(this.adicionaUm(listaObjetos[i]))
        }
        Promise.all(l)
    }

    async adicionaUm(objeto) {
        const o = await this._gerarAtributosJSON(objeto)
        await this._DAO.adiciona(o)
    }

    async idAttr(novoId) {
        await this._validaNotNull("id", novoId)
        await this._validaInteiro(`id`, novoId, 1)

        const objeto = await this._DAO.busca({
            id: novoId
        })

        if (objeto.length === 0) {
            throw new Error(await this._formataErro(`${this.nomeSingular}: id`, novoId, "O valor informado não está cadastrado."))
        }

        return novoId
    }

    async dataAlteracaoAttrQuery(data) {
        await this._validaDataISO8601("dataAlteracao", data)
        return data
    }

    async dataCriacaoAttrQuery(data) {
        await this._validaDataISO8601("dataCriacao", data)
        return data
    }

    async ordemAttrQuery(ordem) {
        if (ordem !== "ASC" && ordem !== "DESC") {
            throw new Error(JSON.stringify({
                msg: "A ordem deve ser ASC ou DESC"
            }))
        }
        return ordem
    }

    async ordenarPorAttrQuery(ordenarPor) {
        const key = `${ordenarPor}Attr`
        if (this[key] === undefined || this[key] === null) {
            throw new Error(JSON.stringify({
                msg: "Parâmetro inválido."
            }))
        }
        return ordenarPor
    }

    async limiteAttrQuery(limite) {
        await this._validaNotNull("limite", limite)
        await this._validaInteiro("limite", limite, 1)
        return limite
    }

    async _gerarQueryJSON(objeto) {
        const keys = Object.keys(objeto)
        let o = {}
        for (let i = 0; i < keys.length; i++) {
            let key = `${keys[i]}Attr`
            if (this[key] === undefined || this[key] === null) {
                key = `${keys[i]}AttrQuery`
            }
            if (this[key] === undefined || this[key] === null) {
                this.errosValidacao.push(JSON.parse(await this._formataErro(keys[i], o[keys[i]], "Parâmetro inválido")))
                break
            }
            try {
                o[keys[i]] = await this[key](objeto[keys[i]])
                if (o[keys[i]] instanceof String) {
                    o[keys[i]] = sanitizer.escape(o[keys[i]])
                    o[keys[i]] = sanitizer.sanitize(o[keys[i]])
                }
            } catch (e) {
                try {
                    JSON.parse(e.message)
                } catch (e2) {
                    throw e
                }
                this.errosValidacao.push(JSON.parse(e.message))
            }
        }
        if (this.errosValidacao.length > 0) {
            throw new Error(await this._formataErro(undefined, this.errosValidacao, "Erros de validação."))
        }
        return o
    }

    async _gerarAtributosJSON(objeto) {
        const keys = Object.keys(objeto)
        let o = {}
        if (keys.length === 0) {
            this.errosValidacao.push({
                msg: "O objeto não pode ser vazio."
            })
        } else {
            for (let i = 0; i < keys.length; i++) {
                const key = `${keys[i]}Attr`
                if (this[key] === undefined || this[key] === null) {
                    this.errosValidacao.push(JSON.parse(await this._formataErro(keys[i], o[keys[i]], "Parâmetro inválido")))
                    break
                }
                try {
                    o[keys[i]] = await this[key](objeto[keys[i]])
                    if (o[keys[i]] instanceof String) {
                        o[keys[i]] = sanitizer.escape(o[keys[i]])
                        o[keys[i]] = sanitizer.sanitize(o[keys[i]])
                    }
                } catch (e) {
                    try {
                        JSON.parse(e.message)
                    } catch (e2) {
                        throw e
                    }
                    this.errosValidacao.push(JSON.parse(e.message))
                }
            }
        }
        if (this.errosValidacao.length > 0) {
            throw new Error(await this._formataErro(undefined, this.errosValidacao, "Erros de validação."))
        }
        return o
    }

    async _converterForeignKeyEmJSON(objeto) {
        let o = JSON.parse(JSON.stringify(objeto))
        const keys = Object.keys(o)

        for (let i = 0; i < keys.length; i++) {
            if (Object.keys(nomesPlural).includes(keys[i])) {
                let nomeSingular = keys[i]
                let nomePlural = nomesPlural[nomeSingular]

                let resultado = await (new DAO(nomePlural)).busca({
                    id: o[nomeSingular]
                })
                resultado = await this._converterForeignKeyEmJSON(resultado)

                o[nomeSingular] = resultado
            }
        }
        return o
    }

    async _formataErro(param, value, msg) {
        let erroFormatado = {
            msg,
            param,
            value
        }
        return JSON.stringify(erroFormatado)
    }

    async _validaCampoUnico(atributo, valor) {
        let query = {}
        query[atributo] = valor
        const objeto = await this._DAO.busca(query)
        if (objeto.length > 0) {
            throw new Error(await this._formataErro(atributo, valor, "O valor informado já está cadastrado."))
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

        if (Number(valor) % 1 === 0 || Number(valor) > maximo || Number(valor) < minimo) {
            throw new Error(await this._formataErro(atributo, Number(valor), `O valor deve ser um número de ponto flutuante, com um ponto separando a parte inteira da parte decimal, e estar entre ${minimo} e ${maximo}`))
        }
    }

    async _validaInteiro(atributo, valor, minimo, maximo) {
        if (minimo == null) {
            minimo = -9223372036854775808
        }

        if (maximo == null) {
            maximo = 9223372036854775808
        }

        if (Number(valor) % 1 !== 0 || Number(valor) > maximo || Number(valor) < minimo) {
            throw new Error(await this._formataErro(atributo, Number(valor), `O valor deve ser um número inteiro e estar entre ${minimo} e ${maximo}`))
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