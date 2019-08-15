const Model = require("./Model")
const Fornecedores = require("./Fornecedores")

module.exports = class Produtos extends Model {
    constructor(){
        super("produto", "produtos")
    }

    async nome(novoNome){
        await this._validaNotNull("nome", novoNome)
        await this._validaMinMaxChars("nome", novoNome, 1, 100)
        return novoNome
    }

    async categoria(novaCategoria) {
        await this._validaNotNull("categoria", novaCategoria)
        await this._validaMaxChars("categoria", novaCategoria, 100)
        return novaCategoria
    }

    async precoUnidade(novoPrecoUnidade) {
        await this._validaNotNull("precoUnidade", novoPrecoUnidade)
        await this._validaDecimal("precoUnidade", novoPrecoUnidade, 0)
        return novoPrecoUnidade
    }

    async descricao(novaDescricao) {
        await this._validaNotNull("descricao", novaDescricao)
        await this._validaMaxChars("descricao", novaDescricao, 255)
        return novaDescricao
    }

    async garantia(novaGarantia) {
        await this._validaNotNull("garantia", novaGarantia)
        await this._validaInteiro("garantia", novaGarantia, 0)
        return novaGarantia
    }

    async dataFabricacao(novaDataFabricacao) {
        await this._validaNotNull("dataFabricacao", novaDataFabricacao)
        await this._validaDataISO8601("dataFabricacao", novaDataFabricacao)
        return novaDataFabricacao
    }

    async dataValidade(novaDataValidade) {
        await this._validaNotNull("dataValidade", novaDataValidade)
        await this._validaDataISO8601("dataValidade", novaDataValidade)
        return novaDataValidade
    }

    async fornecedor(novoFornecedor) {
        const fornecedores = new Fornecedores()
        return fornecedores.id(novoFornecedor)
    }

}