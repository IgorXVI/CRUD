const Controller = require("./Controller")

module.exports = class FornecedoresController extends Controller{
    constructor(){
        super(`fornecedores`, `fornecedor`, `CNPJ, nome, email, cidade, dataAlteracao, 
        dataCriacao, telefone, bairro, rua, numeroCasa, complemento`, false)

        this.masterDAO = this.fornecedoresDAO

        super.gerarRotaBuscaTodos()
        super.gerarRotaBuscaUm()
        super.gerarRotaAdicionaUm(this.validacaoCustomizada(true))
        super.gerarRotaAtualizaUm(this.validacaoCustomizada(false))
        super.gerarRotaDeletaUm()
    }

    validacaoCustomizada(obrigatorio) {
        let validacao = super.gerarValidacao(obrigatorio)

        validacao.push(this.body("email").custom(email => {
            return this.fornecedoresDAO.buscaPorEmail(email).then(fornecedor => {
                if (fornecedor) {
                    return Promise.reject('O atributo email informado já está cadastrado.');
                }
            });
        }).optional())

        return validacao
    }

}