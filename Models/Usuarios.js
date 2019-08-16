const PessoaFisica = require("./PessoaFisica")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
module.exports = class Ususarios extends PessoaFisica {
    constructor(nomeSingular, nomePlural) {
        super(nomeSingular, nomePlural)
    }

    async gerarJWT(objeto) {
        await this.gerarAtributosJSON(objeto)
        const dadosBanco = await this._DAO.busca({email: objeto.email})
        if (!dadosBanco) {
            throw new Error(await this._formataErro(undefined, undefined, "Email ou senha incorretos."))
        }
        const senhaEhValida = await bcrypt.compare(objeto.senha, dadosBanco.senha)
        if (!senhaEhValida) {
            throw new Error(await this._formataErro(undefined, undefined, "Email ou senha incorretos."))
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

    async senhaAttr(novaSenha) {
        await this._validaNotNull("senha", novaSenha)
        await this._validaMinMaxChars("senha", novaSenha, 8, 255)
        return bcrypt.hash(novaSenha, 10)
    }

    async nivelAcessoAttr(novoNivelAcesso) {
        await this._validaNotNull("nivelAcesso", novoNivelAcesso)
        await this._validaInteiro("nivelAcesso", novoNivelAcesso, 0, 2)
        return novoNivelAcesso
    }

}