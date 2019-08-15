const Model = require("./Model")
const Clientes = require("./Clientes")
const Funcionarios = require("./Funcionarios")

module.exports = class Vendas extends Model {
    constructor() {
        super("venda", "vendas")
    }

    async valorTotal(novoValorTotal){
        await this._validaNotNull("valorTotal", novoValorTotal)
        await this._validaDecimal("valorTotal", novoValorTotal, 0)
        return novoValorTotal
    }

    async cliente(novoCliente){
        const clientes = new Clientes()
        return clientes.id(novoCliente)
    }

    async functionario(novoFuncionario){
        const funcionarios = new Funcionarios()
        return funcionarios.id(novoFuncionario)
    }

}