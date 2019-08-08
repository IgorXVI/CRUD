const PessoaJuridicaController = require("./PessoaJuridicaController")
const FornecedoresDAO = require("../DAOs/FornecedoresDAO")

module.exports = class FornecedoresController extends PessoaJuridicaController{
    constructor(){
        super(`fornecedores`, `fornecedor`, [], true, new FornecedoresDAO())
    }

}