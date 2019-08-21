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
                validacao: this._validaId,
                sql: `INTEGER PRIMARY KEY AUTOINCREMENT`
            },
            dataAlteracao: {
                validacao: this._validaDataAlteracao,
                sql: `VARCHAR(24) NOT NULL`
            },
            dataCriacao: {
                validacao: this._validaDataCriacao,
                sql: `VARCHAR(24) NOT NULL`
            },
            ordem: {
                validacao: this._validaOrdem
            },
            ordenarPor: {
                validacao: this._validaOrdenarPor
            },
            limite: {
                validacao: this._validaLimite
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

    async busca(query) {
        const q = await this._gerarAtributosJSON(query, "query")
        let arr = await this._DAO.busca(q)
        for (let i = 0; i < arr.length; i++) {
            arr[i] = this._converterForeignKeyEmJSON(arr[i])
        }
        return Promise.all(arr)
    }

    async buscaUm(id) {
        const resultado = (await this.busca({
            id
        }))[0]
        if (!resultado) {
            return {}
        }
        return resultado
    }

    async deleta(query) {
        const q = await this._gerarAtributosJSON(query, "query")
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

    async atualiza(objeto, query) {
        const o = await this._gerarAtributosJSON(objeto, "attrs")
        const q = await this._gerarAtributosJSON(query, "query")
        const changes = (await this._DAO.atualiza(o, q)).changes
        return {
            changes
        }
    }

    async atualizaUm(objeto, id) {
        return this.atualiza(objeto, {
            id
        })
    }

    async adiciona(listaObjetos) {
        let l = []
        for (let i = 0; i < listaObjetos.length; i++) {
            l.push(this.adicionaUm(listaObjetos[i]))
        }
        return Promise.all(l)
    }

    async adicionaUm(objeto) {
        let o = await this._gerarAtributosJSON(objeto, "attrs")
        const id = (await this._DAO.adiciona(o)).lastInsertRowid
        o.id = id
        return this._converterForeignKeyEmJSON(o)
    }

    async _gerarSchema() {
        try {
            await this._DAO.criarSchema(this.attrs)
        } catch (e) {
            log(e)
            console.log(e)
        }
    }

    async _gerarAtributosJSON(objeto, local) {
        const keys = Object.keys(this.attrs)
        let o = {}
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i]
            await this.attrs[k].validacao(objeto[k], local)
            o[k] = objeto[k]
            o[k] = sanitizer.sanitize(o[k])
        }
        if (this.errosValidacao.errors.length > 0) {
            throw new Error("Erros de validação.")
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

    async _adicionaErroValidacao(param, value, msg, location) {
        const errorHelper = new ErrorHelper()
        this.errosValidacao.errors.push(await errorHelper.formataErro(param, value, msg, location))
    }

    async _validaId(novoId, local) {
        if (local !== "query" && novoId) {
            await this._adicionaErroValidacao("id", novoId, "Parâmetro inválido.", local)
        } else {
            await this._validaNotNull("id", novoId, local)
            await this._validaInteiro(`id`, novoId, 1, undefined, local)
        }
    }

    async _validaDataAlteracao(data, local) {
        if (local !== "query" && data) {
            await this._adicionaErroValidacao("dataAlteracao", data, "Parâmetro inválido.", local)
        } else {
            await this._validaDataISO8601("dataAlteracao", data, "query")
        }
    }

    async _validaDataCriacao(data, local) {
        if (local !== "query" && data) {
            await this._adicionaErroValidacao("dataCriacao", data, "Parâmetro inválido.", local)
        } else {
            await this._validaDataISO8601("dataCriacao", data, "query")
        }
    }

    async _validaOrdem(ordem, local) {
        if (local !== "query" && ordem) {
            await this._adicionaErroValidacao("ordem", ordem, "Parâmetro inválido.", local)
        } else {
            if (ordem !== "ASC" && ordem !== "DESC") {
                await this._adicionaErroValidacao("ordem", ordem, "A ordem deve ser ASC ou DESC", "query")
            }
        }
    }

    async _validaOrdenarPor(ordenarPor, local) {
        if (local !== "query" && ordenarPor) {
            await this._adicionaErroValidacao("ordenarPor", ordenarPor, "Parâmetro inválido.", local)
        } else {
            if (!Object.keys(this.attrs).includes(ordenarPor)) {
                await this._adicionaErroValidacao("ordenarPor", ordenarPor, "Parâmetro inválido.", "query")
            }
        }
    }

    async _validaLimite(limite, local) {
        if (local !== "query" && limite) {
            await this._adicionaErroValidacao("limite", limite, "Parâmetro inválido.", local)
        } else {
            await this._validaNotNull("limite", limite, "query")
            await this._validaInteiro("limite", limite, 1, undefined, "query")
        }
    }

    async _validaFK(nomeSingular, nomePlural, FK, local) {
        if (local === "attrs") {
            await this._validaNotNull(nomeSingular, FK, local)
            await this._validaInteiro(nomeSingular, FK, 1, local)

            const DAOFK = new DAO(nomePlural)
            const objeto = await DAOFK.busca({
                id: FK
            })
            if (objeto.length === 0) {
                await this._adicionaErroValidacao(nomeSingular, FK, "O valor informado não está cadastrado", local)
            }
        }
    }

    async _validaCombinacaoUnica(query, local) {
        if (local === "attrs") {
            const objeto = await this._DAO.busca(query)
            if (objeto.length > 0) {
                await this._adicionaErroValidacao(Object.keys(query), Object.values(query), "Não podem existir dois atributos com os valores iguais paras os atributos.", local)
            }
        }
    }

    async _validaCampoUnico(atributo, valor, local) {
        if (local === "attrs") {
            let query = {}
            query[atributo] = valor
            const objeto = await this._DAO.busca(query)
            if (objeto.length > 0) {
                await this._adicionaErroValidacao(atributo, valor, "O valor informado já está cadastrado.", local)
            }
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