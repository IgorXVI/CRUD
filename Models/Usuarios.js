const PessoaFisica = require("./PessoaFisica")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
module.exports = class Ususarios extends PessoaFisica {
    constructor(nomeSingular, nomePlural) {
        super(nomeSingular, nomePlural)
    }

    async gerarJWT(objeto) {
        await this._gerarAtributosJSON(objeto, "attrs")
        const dadosBanco = await this._DAO.busca({email: objeto.email})
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

    async senhaAttr(novaSenha, local) {
        await this._validaNotNull("senha", novaSenha, local)
        await this._validaMinMaxChars("senha", novaSenha, 8, 255, local)
        return bcrypt.hash(novaSenha, 10)
    }

    async nivelAcessoAttr(novoNivelAcesso, local) {
        await this._validaNotNull("nivelAcesso", novoNivelAcesso, local)
        await this._validaInteiro("nivelAcesso", novoNivelAcesso, 0, 2, local)
        return novoNivelAcesso
    }

}