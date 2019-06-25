const Controller = require("./Controller")

const {
    body
} = require("express-validator/check")

module.exports = class CidadesController extends Controller {
    constructor() {
        super(`cidades`, `cidade`, `nome, UF, CEP, dataAlteracao, dataCriacao`, false)

        this.masterDAO = this.cidadesDAO

        super.gerarRotaBuscaTodos()
        super.gerarRotaBuscaUm()
        this.gerarRotaAdicionaUm()
        this.gerarRotaAtualizaUm()
        super.gerarRotaDeletaUm()
    }

    validacaoCustomizada(obrigatorio){
        let validaNomeJaCadastrado = body("nome").custom(nome => {
            return this.cidadesDAO.buscaPorNome(nome).then(cidade => {
                if (cidade) {
                    return Promise.reject('O atributo nome informado já está cadastrado.');
                }
            });
        }).optional()

        let validacao = super.gerarValidacao(obrigatorio)
        validacao.push(validaNomeJaCadastrado)
        return validacao
    }

    gerarRotaAdicionaUm() {
        let customValidacao = super.gerarValidacao(true)
        customValidacao.push(this.validaNomeJaCadastrado)

        this.router.post("/cidade", customValidacao, (req, res) => {
            if (super.inicio(req, res, `Adicionando cidade...`)) {
                return
            }

            const objeto = super.gerarObjeto(req)
            super.adicionaUm(req, res, objeto)
        })
    }

    gerarRotaAtualizaUm() {
        let customValidacao = super.gerarValidacao(false)
        customValidacao.push(this.validaNomeJaCadastrado)

        this.router.post("/cidade/:id", customValidacao, (req, res) => {
            if (super.inicio(req, res, `Atualizando cidade com id = ${req.params.id}...`)) {
                return
            }

            const objeto = super.gerarObjeto(req)
            super.atualizaUm(req, res, objeto)
        })
    }

}