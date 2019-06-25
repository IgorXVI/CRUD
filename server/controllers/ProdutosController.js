const Controller = require("./Controller")

module.exports = class ProdutosController extends Controller {
    constructor() {
        super(`produtos`, `produto`, `nome, categoria, precoUnidade, fornecedor, dataAlteracao, 
        dataCriacao, descricao, garantia, dataFabric, dataValidade`, false)

        this.masterDAO = this.produtosDAO

        super.gerarRotaBuscaTodos()
        super.gerarRotaBuscaUm()
        super.gerarRotaAdicionaUm(this.validacaoCustomizada(true))
        super.gerarRotaAtualizaUm(this.validacaoCustomizada(false))
        super.gerarRotaDeletaUm()
    }

    validacaoCustomizada(obrigatorio) {
        let validacao = super.gerarValidacao(obrigatorio)

        validacao.push(this.body("nome").custom(nome => {
            return this.produtosDAO.buscaPorNome(nome).then(produto => {
                if (produto) {
                    return Promise.reject('O valor informado já está cadastrado.');
                }
            });
        }).optional())

        return validacao
    }

}