const Model = require("./Model")

module.exports = class Produtos extends Model {
    constructor(){
        super("produto", "produtos")

        this.fornecedorFK = {}
    }

    async nomeAttr(novoNome, local){
        await this._validaNotNull("nome", novoNome, local)
        await this._validaMinMaxChars("nome", novoNome, 1, 100, local)
        return novoNome
    }

    async categoriaAttr(novaCategoria, local) {
        await this._validaNotNull("categoria", novaCategoria, local)
        await this._validaMaxChars("categoria", novaCategoria, 100, local)
        return novaCategoria
    }

    async precoUnidadeAttr(novoPrecoUnidade, local) {
        await this._validaNotNull("precoUnidade", novoPrecoUnidade, local)
        await this._validaDecimal("precoUnidade", novoPrecoUnidade, 0, undefined, local)
        return novoPrecoUnidade
    }

    async descricaoAttr(novaDescricao, local) {
        await this._validaNotNull("descricao", novaDescricao, local)
        await this._validaMaxChars("descricao", novaDescricao, 255, local)
        return novaDescricao
    }

    async garantiaAttr(novaGarantia, local) {
        await this._validaNotNull("garantia", novaGarantia, local)
        await this._validaInteiro("garantia", novaGarantia, 0, undefined, local)
        return novaGarantia
    }

    async dataFabricacaoAttr(novaDataFabricacao, local) {
        await this._validaNotNull("dataFabricacao", novaDataFabricacao, local)
        await this._validaDataISO8601("dataFabricacao", novaDataFabricacao, local)
        return novaDataFabricacao
    }

    async dataValidadeAttr(novaDataValidade, local) {
        await this._validaNotNull("dataValidade", novaDataValidade, local)
        await this._validaDataISO8601("dataValidade", novaDataValidade, local)
        return novaDataValidade
    }

    async fornecedorAttr(novoFornecedor, local) {
        await this._validaFK("fornecedor", "fornecedores", novoFornecedor, local)
        return novoFornecedor
    }

}