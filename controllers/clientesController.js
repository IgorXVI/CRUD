const Controller = require("./Controller")

module.exports = class ClientesController extends Controller {
    constructor() {
        super(`clientes`, `cliente`, `CPF, nome, email, cidade, dataAlteracao, dataCriacao, bairro, rua, numeroCasa, 
        telefone, dataNasc, complemento`, false)

        this.masterDAO = this.clientesDAO

        super.gerarRotaBuscaTodos()
        super.gerarRotaBuscaUm()
        super.gerarRotaAdicionaUm(this.validacaoCustomizada(true))
        super.gerarRotaAtualizaUm(this.validacaoCustomizada(false))
        super.gerarRotaDeletaUm()
    }

    validacaoCustomizada(obrigatorio) {
        let validacao = super.gerarValidacao(obrigatorio)

        validacao.push(this.body("email").custom(email => {
            return this.clientesDAO.buscaPorEmail(email).then(cliente => {
                if (cliente) {
                    return Promise.reject('O atributo email informado já está cadastrado.');
                }
            });
        }).optional())

        return validacao
    }

}