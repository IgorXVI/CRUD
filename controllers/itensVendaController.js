const Controller = require("./Controller")

module.exports = class ItensVendaController extends Controller{
    constructor(){
        super(`itens-venda`, `item`, `valorTotal, funcionario, cliente, dataAlteracao, dataCriacao`, true)

        this.masterDAO = this.itensVendaDAO
    }
}