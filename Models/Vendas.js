const Model = require("./Model")
const Clientes = require("./Clientes")
const Funcionarios = require("./Funcionarios")

module.exports = class Vendas extends Model {
    constructor() {
        super("venda", "vendas")

        this.clienteFK = {}
        this.funcionarioFK = {}
    }

    async valorTotalAttr(novoValorTotal){
        await this._validaNotNull("valorTotal", novoValorTotal)
        await this._validaDecimal("valorTotal", novoValorTotal, 0)
        return novoValorTotal
    }

    async clienteAttr(novoCliente){
        const clientes = new Clientes()
        return await clientes.idAttr(novoCliente)
    }

    async funcionarioAttr(novoFuncionario){
        const funcionarios = new Funcionarios()
        return await funcionarios.idAttr(novoFuncionario)
    }

}