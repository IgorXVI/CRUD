const Controller = require("./Controller")

module.exports = class ProdutosController extends Controller {
    constructor() {
        super(`produtos`, `produto`, `nome, categoria, precoUnidade, fornecedor, dataAlteracao, 
        dataCriacao, descricao, garantia, dataFabric, dataValidade`, true)

        this.masterDAO = this.usuariosDAO
    }
}