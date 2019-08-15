const Model = require("./Model")
const Produtos = require("./Produtos")
const Clientes = require("./Clientes")
const Armazens = require("./Armazens")

module.exports = class Transportes extends Model {
    constructor(){
        super("transporte", "transportes")
    }

    async quantidade(novaQuantidade){
        await this._validaNotNull("quantiade", novaQuantidade)
        await this._validaInteiro("quantidade", novaQuantidade, 1)
        return novaQuantidade
    }

    async produto(novoProduto){
        const produtos = new Produtos()
        return produtos.id(novoProduto)
    }

    async cliente(novoCliente){
        const clientes = new Clientes()
        return clientes.id(novoCliente)
    }

    async armazem(novoArmazem){
        const armazens = new Armazens()
        return armazens.id(novoArmazem)
    }

}