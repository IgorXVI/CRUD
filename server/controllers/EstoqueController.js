const Controller = require("./Controller")

module.exports = class EstoqueController extends Controller{
    constructor(){
        super(`estoque`, `produto-estocado`, `quantidade, idProduto, dataAlteracao, dataCriacao`, true)

        this.masterDAO = this.estoqueDAO
    }
}