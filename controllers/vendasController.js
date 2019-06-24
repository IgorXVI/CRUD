const Controller = require("./Controller")

module.exports = class VendasController extends Controller{
    constructor(){
        super(`vendas`, `venda`, `valorTotal, funcionario, cliente, dataAlteracao, dataCriacao`, true)

        this.masterDAO = this.vendasDAO
    }
}