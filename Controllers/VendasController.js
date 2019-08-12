const Vendas = require("../Models/Vendas")
const Controller = require("./Controller")

module.exports = class VendasController extends Controller {
    constructor(){
        super(new Vendas(), true)

        this.gerarRotaAdicionaUm()
        this.gerarRotaBuscaTodos()
        this.gerarRotaBuscaUm()
        this.gerarRotaDeletaUm()
    }
}

