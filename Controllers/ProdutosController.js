const Produtos = require("../Models/Produtos")
const Controller = require("./Controller")

module.exports = class ProdutosController extends Controller {
    constructor(){
        super(new Produtos())
    }
}

