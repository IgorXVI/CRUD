const PessoaFisica = require("./PessoaFisica")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

module.exports = class Ususarios extends PessoaFisica {
    constructor(nomeSingular, nomePlural) {
        super(nomeSingular, nomePlural)

        Object.assign(this.attrsValidacao, {
            senha: {
                validacao: this._validaSenha,
                sql: `VARCHAR(8) NOT NULL`
            },
            nivelAcesso: {
                validacao: this._validaNivelAcesso,
                sql: `INTEGER NOT NULL`
            }
        })

        this._gerarAtributosJSON = this._gerarAtributosJSON.bind(this)
    }

    async _gerarAtributosJSON(objeto, local) {
        let o = await super._gerarAtributosJSON(objeto, local)
        if (o.senha && local === "attrs") {
            o.senha = await bcrypt.hash(o.senha, 10)
        }
        return o
    }

    async gerarJWT(objeto) {
        await this._gerarAtributosJSON(objeto, "attrs")
        const dadosBanco = await this._DAO.busca({
            email: objeto.email
        })
        if (!dadosBanco) {
            await this.adicionaErroValidacao("email ou senha", `${objeto.email} ou ${objeto.senha}`, "Email ou senha incorretos.", "attrs")
            throw new Error("Erros de validação.")
        }
        const senhaEhValida = await bcrypt.compare(objeto.senha, dadosBanco.senha)
        if (!senhaEhValida) {
            await this.adicionaErroValidacao("email ou senha", `${objeto.email} ou ${objeto.senha}`, "Email ou senha incorretos.", "attrs")
            throw new Error("Erros de validação.")
        }
        const token = jwt.sign({
                id: dadosBanco.id,
                nivelAcesso: dadosBanco.nivelAcesso
            },
            process.env.SECRET, {
                expiresIn: "1h"
            }
        )
        return token
    }

    async _validaSenha(novaSenha, local) {
        await this._validaNotNull("senha", novaSenha, local)
        await this._validaMinMaxChars("senha", novaSenha, 8, 255, local)
    }

    async _validaNivelAcesso(novoNivelAcesso, local) {
        await this._validaNotNull("nivelAcesso", novoNivelAcesso, local)
        await this._validaInteiro("nivelAcesso", novoNivelAcesso, 0, 2, local)
    }

}