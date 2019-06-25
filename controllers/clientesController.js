const Controller = require("./Controller")

module.exports = class ClientesController extends Controller {
    constructor() {
        super(`clientes`, `cliente`, `CPF, nome, email, cidade, dataAlteracao, dataCriacao, bairro, rua, numeroCasa, 
        telefone, dataNasc, complemento`, false)

        this.masterDAO = this.clientesDAO

        super.gerarRotaBuscaTodos()
        super.gerarRotaBuscaUm()
        this.gerarRotaAdicionaUm()
        this.gerarRotaAtualizaUm()
        super.gerarRotaDeletaUm()
    }

    validacaoCustomizada(obrigatorio){
        let validaEmailJaCadastrado = body("email").custom(email => {
            return this.clientesDAO.buscaPorEmail(email).then(cliente => {
                if (cliente) {
                    return Promise.reject('O atributo email informado já está cadastrado.');
                }
            });
        }).optional()

        let validacao = super.gerarValidacao(obrigatorio)
        validacao.push(validaEmailJaCadastrado)
        return validacao
    }

    gerarRotaAdicionaUm() {
        this.router.post("/cliente", this.validacaoCustomizada(true), (req, res) => {
            if (super.inicio(req, res, `Adicionando cliente...`)) {
                return
            }

            const objeto = super.gerarObjeto(req)
            super.adicionaUm(req, res, objeto)
        })
    }

    gerarRotaAtualizaUm() {

        this.router.post("/cliente/:id", this.validacaoCustomizada(false), (req, res) => {
            if (super.inicio(req, res, `Atualizando cliente com id = ${req.params.id}...`)) {
                return
            }

            const objeto = super.gerarObjeto(req)
            super.atualizaUm(req, res, objeto)
        })
    }

}