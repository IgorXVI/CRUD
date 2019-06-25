const Controller = require("./Controller")

module.exports = class CidadesController extends Controller {
    constructor() {
        super(`cidades`, `cidade`, `nome, UF, CEP, dataAlteracao, dataCriacao`, false)

        this.masterDAO = this.cidadesDAO

        super.gerarRotaBuscaTodos()
        super.gerarRotaBuscaUm()
        super.gerarRotaAdicionaUm(this.validacaoCustomizada(true))
        super.gerarRotaAtualizaUm(this.validacaoCustomizada(false))
        super.gerarRotaDeletaUm()
    }

    validacaoCustomizada(obrigatorio) {
        let validacao = super.gerarValidacao(obrigatorio)

        validacao.push(this.body("nome").custom(nome => {
            return this.cidadesDAO.buscaPorNome(nome).then(cidade => {
                if (cidade) {
                    return Promise.reject('O valor informado já está cadastrado.');
                }
            });
        }).optional())

        return validacao
    }
}