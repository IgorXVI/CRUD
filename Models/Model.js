const DAO = require("../database/DAO")
const sanitizer = require('sanitizer')
const ErrorHelper = require("../Helpers/ErrorHelper")
const log = require('log-to-file')

const nomesPlural = require("./nomesPlural")

module.exports = class Model {
    constructor(nomeSingular, nomePlural) {
        this.nomeSingular = nomeSingular
        this.nomePlural = nomePlural

        this._gerarAtributosJSON = this._gerarAtributosJSON.bind(this)

        nomesPlural[nomeSingular] = nomePlural

        this._DAO = new DAO(nomePlural)

        this.errosValidacao = {
            msg: "Erros de validação.",
            errors: []
        }

        this.attrs = {}

        Object.assign(this.attrs, {
            id: {
                validacaoQuery: this._validaId,
                sql: `INTEGER PRIMARY KEY AUTOINCREMENT`
            },
            dataAlteracao: {
                validacaoQuery: this._validaDataAlteracao,
                sql: `VARCHAR(24) NOT NULL`
            },
            dataCriacao: {
                validacaoQuery: this._validaDataCriacao,
                sql: `VARCHAR(24) NOT NULL`
            },
            ordem: {
                validacaoQuery: this._validaOrdem
            },
            ordenarPor: {
                validacaoQuery: this._validaOrdenarPor
            },
            limite: {
                validacaoQuery: this._validaLimite
            }
        })

        this._gerarSchema = this._gerarSchema.bind(this)
    }

    async pegarErrosValidacao() {
        const r = JSON.parse(JSON.stringify(this.errosValidacao))
        this.errosValidacao = {
            msg: "Erros de validação",
            errors: []
        }
        return r
    }

    async umErroValidacao(param, value, msg, location) {
        await this._adicionaErroValidacao(param, value, msg, location)
        throw new Error("Erro de validação.")
    }

    async busca(query, local) {
        const q = await this._gerarQueryJSON(query, local)
        let arr = await this._DAO.busca(q)
        for (let i = 0; i < arr.length; i++) {
            arr[i] = this._converterForeignKeyEmJSON(arr[i])
        }
        return Promise.all(arr)
    }

    async buscaUm(id, local) {
        const resultado = (await this.busca({
            id
        }, local))[0]
        if (!resultado) {
            return {}
        }
        return resultado
    }

    async deleta(query, local) {
        const q = await this._gerarQueryJSON(query, local)
        const changes = (await this._DAO.deleta(q)).changes
        return {
            changes
        }
    }

    async deletaUm(id) {
        return this.deleta({
            id
        })
    }

    async atualiza(objeto, query, localObjeto, localQuery) {
        const o = await this._gerarAtributosJSON(objeto, localObjeto)
        const q = await this._gerarQueryJSON(query, localQuery)
        const changes = (await this._DAO.atualiza(o, q)).changes
        return {
            changes
        }
    }

    async atualizaUm(objeto, id, localObjeto, localId) {
        return this.atualiza(objeto, {
            id
        }, localObjeto, localId)
    }

    async adiciona(listaObjetos, local) {
        let l = []
        for (let i = 0; i < listaObjetos.length; i++) {
            l.push(this.adicionaUm(listaObjetos[i], local))
        }
        return Promise.all(l)
    }

    async adicionaUm(objeto, local) {
        let o = await this._gerarAtributosJSON(objeto, local)
        o.dataCriacao = (new Date()).toISOString()

        const id = (await this._DAO.adiciona(o)).lastInsertRowid
        o.id = id
        return this._converterForeignKeyEmJSON(o)
    }

    async _gerarSchema() {
        try {
            let attrsSchema = {}
            const keys = Object.keys(this.attrs)
            for (let i = 0; i < keys.length; i++) {
                const k = keys[i]

                if (this.attrs[k].sql) {
                    attrsSchema[k] = this.attrs[k]
                }
            }

            await this._DAO.criarSchema(attrsSchema)
        } catch (e) {
            log(e)
            console.log(e)
        }
    }

    async _gerarJSON(objeto, local, nomeAtributoDeValidacao) {
        let o = {}

        const keys = Object.keys(this.attrs)
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i]

            if (this.attrs[k][nomeAtributoDeValidacao]) {
                await this.attrs[k][nomeAtributoDeValidacao](objeto[k], local)
                o[k] = objeto[k]
                o[k] = sanitizer.sanitize(o[k])
            } else if (this.attrs[k].validacao) {
                await this.attrs[k].validacao(objeto[k], local)
                o[k] = objeto[k]
                o[k] = sanitizer.sanitize(o[k])
            }
        }

        if (this.errosValidacao.errors.length > 0) {
            throw new Error("Erros de validação.")
        }
    }

    async _gerarQueryJSON(query, local) {
        return this._gerarJSON(query, local, "validacaoQuery")
    }

    async _gerarAtributosJSON(objeto, local) {
        let o = await this._gerarJSON(objeto, local, "validacaoAttr")

        o.dataAlteracao = (new Date()).toISOString()

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

    async _adicionaErroValidacao(param, value, msg, location) {
        const errorHelper = new ErrorHelper()
        this.errosValidacao.errors.push(await errorHelper.formataErro(param, value, msg, location))
    }

    async _validaId(novoId, local) {
        await this._validaPK("id", novoId, local)
    }

    async _validaDataAlteracao(data, local) {
        await this._validaDataISO8601("dataAlteracao", data, local)
    }

    async _validaDataCriacao(data, local) {
        await this._validaDataISO8601("dataCriacao", data, local)
    }

    async _validaOrdem(ordem, local) {
        if (ordem !== "ASC" && ordem !== "DESC") {
            await this._adicionaErroValidacao("ordem", ordem, "A ordem deve ser ASC ou DESC", local)
        }
    }

    async _validaOrdenarPor(ordenarPor, local) {
        if (!Object.keys(this.attrs).includes(ordenarPor)) {
            await this._adicionaErroValidacao("ordenarPor", ordenarPor, "Parâmetro inválido.", local)
        }
    }

    async _validaLimite(limite, local) {
        await this._validaNotNull("limite", limite, local)
        await this._validaInteiro("limite", limite, 1, undefined, local)
    }

    async _validaPK(nomeSingular, PK, local) {
        await this._validaNotNull(nomeSingular, PK, local)
        await this._validaInteiro(nomeSingular, PK, 1, undefined, local)
    }

    async _validaFK(nomeSingular, nomePlural, FK, local) {
        await this._validaPK(nomeSingular, FK, local)

        const DAOFK = new DAO(nomePlural)
        const objeto = await DAOFK.busca({
            id: FK
        })
        if (objeto.length === 0) {
            await this._adicionaErroValidacao(nomeSingular, FK, "O valor informado não está cadastrado", local)
        }
    }

    async _validaCombinacaoUnica(query, local) {
        const objeto = await this._DAO.busca(query)
        if (objeto.length > 0) {
            await this._adicionaErroValidacao(Object.keys(query), Object.values(query), "Não podem existir dois atributos com os valores iguais paras os atributos.", local)
        }
    }

    async _validaCampoUnico(atributo, valor, local) {
        let query = {}
        query[atributo] = valor
        const objeto = await this._DAO.busca(query)
        if (objeto.length > 0) {
            await this._adicionaErroValidacao(atributo, valor, "O valor informado já está cadastrado.", local)
        }
    }

    async _validaNotNull(atributo, valor, local) {
        if (valor === null) {
            await this._adicionaErroValidacao(atributo, valor, "O valor informado não pode ser nulo.", local)
        }
    }

    async _validaFixoChars(atributo, valor, numero, local) {
        if (valor.length > numero || valor.length < numero) {
            await this._adicionaErroValidacao(atributo, valor, `O valor deve conter ${numero} caractéres.`, local)
        }
    }

    async _validaMaxChars(atributo, valor, numero, local) {
        if (valor.length > numero) {
            await this._adicionaErroValidacao(atributo, valor, `O valor deve conter no máximo ${numero} caractéres.`, local)
        }
    }

    async _validaMinMaxChars(atributo, valor, minimo, maximo, local) {
        if (valor.length > maximo || valor.length < minimo) {
            await this._adicionaErroValidacao(atributo, valor, `O valor deve conter no mínimo ${minimo} e no máximo ${maximo} caractéres.`, local)
        }
    }

    async _validaDecimal(atributo, valor, minimo, maximo, local) {
        if (minimo == null) {
            minimo = -1.79769e+308
        }

        if (maximo == null) {
            maximo = 1.79769e+308
        }

        if (Number(valor) % 1 === 0 || Number(valor) > maximo || Number(valor) < minimo) {
            await this._adicionaErroValidacao(atributo, Number(valor), `O valor deve ser um número de ponto flutuante, com um ponto separando a parte inteira da parte decimal, e estar entre ${minimo} e ${maximo}`, local)
        }
    }

    async _validaInteiro(atributo, valor, minimo, maximo, local) {
        if (minimo == null) {
            minimo = -9223372036854775808
        }

        if (maximo == null) {
            maximo = 9223372036854775808
        }

        if (Number(valor) % 1 !== 0 || Number(valor) > maximo || Number(valor) < minimo) {
            await this._adicionaErroValidacao(atributo, Number(valor), `O valor deve ser um número inteiro e estar entre ${minimo} e ${maximo}`, local)
        }
    }

    async _validaDataISO8601(atributo, valor, local) {
        try {
            Date.parse(valor)
        } catch (e) {
            await this._adicionaErroValidacao(atributo, valor, `O valor deve estar no formato ISO8601.`, local)
        }
    }

    async _validaRegex(atributo, valor, regex, local) {
        if (!regex.test(valor)) {
            await this._adicionaErroValidacao(atributo, valor, `O valor está em um formato inválido.`, local)
        }
    }

    async _validaArray(atributo, valor, local) {
        if (!(valor instanceof Array)) {
            await this._adicionaErroValidacao(atributo, valor, "O valor deve ser um array.", local)
        }
    }
}