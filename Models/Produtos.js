const Model = require("./Model")

module.exports = class Produtos extends Model {
    constructor(){
        super("produto", "produtos")

        Object.assign(this.attrsValidacao, {
            nome: this._validaNome,
            categoria: this._validaCategoria,
            precoUnidade: this._validaPrecoUnidade,
            descricao: this._validaDescricao,
            garantia: this._validaGarantia,
            dataFabricacao: this._validaDataFabricacao,
            dataValidade: this._validaDataValidade,
            fornecedor: this._validaFornecedor
        })

        this._gerarSchema()
    }

    async _validaNome(novoNome, local){
        await this._validaNotNull("nome", novoNome, local)
        await this._validaMinMaxChars("nome", novoNome, 1, 100, local)
    }

    async _validaCategoria(novaCategoria, local) {
        await this._validaNotNull("categoria", novaCategoria, local)
        await this._validaMaxChars("categoria", novaCategoria, 100, local)
    }

    async _validaPrecoUnidade(novoPrecoUnidade, local) {
        await this._validaNotNull("precoUnidade", novoPrecoUnidade, local)
        await this._validaDecimal("precoUnidade", novoPrecoUnidade, 0, undefined, local)
    }

    async _validaDescricao(novaDescricao, local) {
        await this._validaNotNull("descricao", novaDescricao, local)
        await this._validaMaxChars("descricao", novaDescricao, 255, local)
    }

    async _validaGarantia(novaGarantia, local) {
        await this._validaNotNull("garantia", novaGarantia, local)
        await this._validaInteiro("garantia", novaGarantia, 0, undefined, local)
    }

    async _validaDataFabricacao(novaDataFabricacao, local) {
        await this._validaNotNull("dataFabricacao", novaDataFabricacao, local)
        await this._validaDataISO8601("dataFabricacao", novaDataFabricacao, local)
    }

    async _validaDataValidade(novaDataValidade, local) {
        await this._validaNotNull("dataValidade", novaDataValidade, local)
        await this._validaDataISO8601("dataValidade", novaDataValidade, local)
    }

    async _validaFornecedor(novoFornecedor, local) {
        await this._validaFK("fornecedor", "fornecedores", novoFornecedor, local)
    }

}