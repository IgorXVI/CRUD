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

    gerarRotaAdicionaUm() {
        this.router.post("/cidade", [
            super.validaNome(true),
            body("nome").custom(nome => {
                return this.cidadesDAO.buscaPorNome(nome).then(cidade => {
                    if (cidade) {
                        return Promise.reject('O atributo nome informado já está cadastrado.');
                    }
                });
            }).optional(),
            super.validaUF(true),
            super.validaCEP(true)
        ], (req, res) => {
            if (super.inicio(req, res, `Adicionando cidade...`)) {
                return
            }

            const objeto = super.gerarObjeto(req)
            super.adicionaUm(req, res, objeto)
        })
    }

    gerarRotaAtualizaUm() {
        this.router.post("/cidade/:id", [
            super.validaNome(false),
            body("nome").custom(nome => {
                return this.cidadesDAO.buscaPorNome(nome).then(cidade => {
                    if (cidade) {
                        return Promise.reject('O atributo nome informado já está cadastrado.');
                    }
                });
            }).optional(),
            super.validaUF(false),
            super.validaCEP(false)
        ], (req, res) => {
            if (super.inicio(req, res, `Atualizando cidade com id = ${req.params.id}...`)) {
                return
            }

            const objeto = super.gerarObjeto(req)
            super.atualizaUm(req, res, objeto)
        })
    }

}