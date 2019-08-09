const DAOs = require("../DAOs/DAOs")
const AlgoComEnderecoController = require("./AlgoComEnderecoController")
const EstoqueDAO = require("../DAOs/EstoqueDAO")
const {
    body
} = require("express-validator/check")
module.exports = class EstoqueController extends AlgoComEnderecoController {
    constructor() {
        super(`estoque`, `produto-estocado`, ['quantidade', 'produto'], true, new EstoqueDAO())
    }

    validaQuantidade(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("quantidade"))
        }
        validacoes.push(this.validaInteiro("quantidade", 0))
        return validacoes
    }

    validaProduto(obrigatorio) {
        let validacoes = new Array()
        if (obrigatorio) {
            validacoes.push(this.validaNotNull("produto"))
        }
        validacoes.push(this.validaInteiro("produto", 1))
        validacoes.push(body("produto").custom(id => {
            return (async () => {
                const produtosDAO = new DAOs.ProdutosDAO()
                const objeto = await produtosDAO.buscaPorID(id)
                if (!objeto) {
                    throw new Error(`O valor informado não está cadastrado.`);
                }
            })()
        }).optional())
        return validacoes
    }

}