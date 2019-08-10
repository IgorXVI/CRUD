const Model = require("./Model")
const DAO = require("../database/DAO")

module.exports = class Produtos extends Model {
    constructor(){
        super("produto", "produtos")

        this.JSON.nome = ""
        this.JSON.categoria = ""
        this.JSON.precoUnidade = ""
        this.JSON.fornecedor = 0
        this.JSON.descricao = ""
        this.JSON.garantia = 0
        this.JSON.dataFabricacao = ""
        this.JSON.dataValidade = ""
    }

    async nome(novoNome){
        await this._validaNotNull("nome", novoNome)
        await this._validaMinMaxChars("nome", novoNome, 1, 100)
        this.JSON.nome = novoNome
    }

    async categoria(novaCategoria) {
        await this._validaNotNull("categoria", novaCategoria)
        await this._validaMaxChars("categoria", novaCategoria, 100)
        this.JSON.categoria = novaCategoria
    }

    async precoUnidade(novoPrecoUnidade) {
        await this._validaNotNull("precoUnidade", novoPrecoUnidade)
        await this._validaDecimal("precoUnidade", novoPrecoUnidade, 0)
        this.JSON.precoUnidade = novoPrecoUnidade
    }

    async descricao(novaDescricao) {
        await this._validaNotNull("descricao", novaDescricao)
        await this._validaMaxChars("descricao", novaDescricao, 255)
        this.JSON.descricao = novaDescricao
    }

    async garantia(novaGarantia) {
        await this._validaNotNull("garantia", novaGarantia)
        await this._validaInteiro("garantia", novaGarantia, 0)
        this.JSON.garantia = novaGarantia
    }

    async dataFabricacao(novaDataFabricacao) {
        await this._validaNotNull("dataFabricacao", novaDataFabricacao)
        await this._validaDataISO8601("dataFabricacao", novaDataFabricacao)
        this.JSON.dataFabricacao = novaDataFabricacao
    }

    async dataValidade(novaDataValidade) {
        await this._validaNotNull("dataValidade", novaDataValidade)
        await this._validaDataISO8601("dataValidade", novaDataValidade)
        this.JSON.dataValidade = novaDataValidade
    }

    async fornecedor(novoFornecedor) {
        await this._validaNotNull("fornecedor", novoFornecedor)
        await this._validaInteiro("fornecedor", novoFornecedor, 1)
        await this._validaExiste(new DAO("fornecedores"), "fornecedor", novoFornecedor)
        this.JSON.fornecedor = novoFornecedor
    }

}