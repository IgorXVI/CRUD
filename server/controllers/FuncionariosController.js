const Controller = require("./Controller")

module.exports = class FuncionariosController extends Controller{
    constructor(){
        super(`funcionarios`, `funcionario`, `CPF, nome, email, salario, cidade, dataAlteracao, 
        dataCriacao, bairro, rua, numeroCasa, telefone, dataNasc, complemento`, false)

        this.masterDAO = this.funcionariosDAO

        super.gerarRotaBuscaTodos()
        super.gerarRotaBuscaUm()
        super.gerarRotaAdicionaUm(this.validacaoCustomizada(true))
        super.gerarRotaAtualizaUm(this.validacaoCustomizada(false))
        super.gerarRotaDeletaUm()
    }

    validacaoCustomizada(obrigatorio) {
        let validacao = super.gerarValidacao(obrigatorio)

        validacao.push(this.body("email").custom(email => {
            return this.funcionariosDAO.buscaPorEmail(email).then(funcionario => {
                if (funcionario) {
                    return Promise.reject('O valor informado já está cadastrado.');
                }
            });
        }).optional())

        return validacao
    }

}