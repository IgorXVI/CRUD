const PessoaFisica = require("./PessoaFisica")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

module.exports = class Ususarios extends PessoaFisica {
    constructor(nomeSingular, nomePlural) {
        super(nomeSingular, nomePlural)
    }

    async gerarJWT(objeto) {
        try {
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
        } catch (e) {
            throw await this._lidarComErro(e)
        }
    }

    async senha(novaSenha) {
        await this._validaNotNull("senha", novaSenha)
        await this._validaMinMaxChars("senha", novaSenha, 8, 255)
        try {
            return bcrypt.hash(novaSenha, 10)
        } catch (e) {
            throw await this._lidarComErro(e)
        }
    }

    async nivelAcesso(novoNivelAcesso) {
        await this._validaNotNull("nivelAcesso", novoNivelAcesso)
        await this._validaInteiro("nivelAcesso", novoNivelAcesso, 0, 2)
        return novoNivelAcesso
    }

    async _lidarComErro(erro) {
        if (erro.message.includes("Erro: erro no gerador de JWT.")) {
            return new Error(await this._formataErro(undefined, undefined, "Email ou senha incorretos."))
        } else {
            return super._lidarComErro(erro)
        }
    }

}