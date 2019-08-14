const PessoaFisica = require("./PessoaFisica")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

module.exports = class Ususarios extends PessoaFisica {
    constructor(nomeSingular, nomePlural) {
        super(nomeSingular, nomePlural)
    }

    async gerarJWT(objeto) {
        await this.gerarAtributosJSON(objeto)
        const dadosBanco = await this._DAO.buscaPorColuna(this.JSON.email, "email")
        if (!dadosBanco) {
            throw new Error("Erro: erro no gerador de JWT.")
        }
        const senhaEhValida = await bcrypt.compare(this.JSON.senha, dadosBanco.senha)
        if (!senhaEhValida) {
            throw new Error("Erro: erro no gerador de JWT.")
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

    async senha(novaSenha) {
        await this._validaNotNull("senha", novaSenha)
        await this._validaMinMaxChars("senha", novaSenha, 8, 255)
        try {
            const hash = await bcrypt.hash(novaSenha, 10)
            return hash
        } catch (e) {
            throw new Error(await this._formataErro(undefined, undefined, "Email ou senha incorretos."))
        }
    }

    async nivelAcesso(novoNivelAcesso) {
        await this._validaNotNull("nivelAcesso", novoNivelAcesso)
        await this._validaInteiro("nivelAcesso", novoNivelAcesso, 0, 2)
        return novoNivelAcesso
    }

}