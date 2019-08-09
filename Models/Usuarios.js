const PessoaFisica = require("./PessoaFisica")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

module.exports = class Ususarios extends PessoaFisica {
    constructor(nomeSingular, nomePlural) {
        super(nomeSingular, nomePlural)

        this._senha = ""
        this._nivelAcesso = 0
    }

    async gerarJWT(objeto) {
        try {
            await this.gerarAtributosJSON(objeto)
            const dadosBanco = await this._DAO.buscaPorColuna(this._email, "email")
            if (!dadosBanco) {
                throw new Error("Erro: erro no gerador de JWT.")
            } else {
                const senhaEhValida = await bcrypt.compare(this._senha, dadosBanco.senha)
                if (!senhaEhValida) {
                    throw new Error("Erro: erro no gerador de JWT.")
                } else {
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
            }
        } catch (e) {
            throw new Error(this._lidarComErro(e))
        }
    }

    async senha(novaSenha) {
        await this._validaNotNull("senha", novaSenha)
        await this._validaMinMaxChars("senha", novaSenha, 8, 255)
        try {
            const hash = await bcrypt.hash(novaSenha, 10)
            this._senha = hash
        }
        catch(e){
            throw new Error(this._lidarComErro(e))
        }
    }

    async nivelAcesso(novoNivelAcesso) {
        await this._validaNotNull("nivelAcesso", novoNivelAcesso)
        await this._validaInteiro("nivelAcesso", novoNivelAcesso, 0, 2)
        this._nivelAcesso = novoNivelAcesso
    }

    async _lidarComErro(erro) {
        if (erro.message.includes("Erro: erro no gerador de JWT.")) {
            return this._formataErro(undefined, undefined, "Email ou senha incorretos.")
        } else {
            super._lidarComErro(erro)
        }
    }

}